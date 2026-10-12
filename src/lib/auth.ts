import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const SESSION_COOKIE_NAME = "grand_kitchen_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "the-grand-kitchen-secret-key-2025-secure-hash-jwt";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "CASHIER";
  exp: number;
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function verifyPassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Universal HMAC-SHA256 Token Creation
export async function createSessionToken(payload: Omit<SessionPayload, "exp">): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
  const data: SessionPayload = { ...payload, exp: expiresAt };
  const jsonStr = JSON.stringify(data);
  const enc = new TextEncoder();
  const encodedPayload = base64UrlEncode(enc.encode(jsonStr));

  const key = await getCryptoKey(SESSION_SECRET);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(encodedPayload));
  const signature = base64UrlEncode(new Uint8Array(signatureBuffer));

  return `${encodedPayload}.${signature}`;
}

// Universal HMAC-SHA256 Token Verification (Works in Edge & Node.js)
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const enc = new TextEncoder();
    const key = await getCryptoKey(SESSION_SECRET);

    // Decode signature
    const sigStr = base64UrlDecode(signature);
    const sigBytes = new Uint8Array(sigStr.length);
    for (let i = 0; i < sigStr.length; i++) {
      sigBytes[i] = sigStr.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(encodedPayload));
    if (!isValid) return null;

    const decodedJson = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(decodedJson) as SessionPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

// Set auth cookie in Next.js Server Action / Route
export async function setAuthCookie(payload: Omit<SessionPayload, "exp">) {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Get session from server action / RSC
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

// Get full current user record from MongoDB
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}
