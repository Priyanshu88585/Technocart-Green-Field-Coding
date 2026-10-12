import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "grand_kitchen_session";
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "the-grand-kitchen-secret-key-2025-secure-hash-jwt-fallback-production-secure";

interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "CASHIER";
  exp: number;
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

async function verifyEdgeToken(token: string): Promise<TokenPayload | null> {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [encodedPayload, signature] = parts;
    if (!encodedPayload || !signature) return null;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigStr = base64UrlDecode(signature);
    const sigBytes = new Uint8Array(sigStr.length);
    for (let i = 0; i < sigStr.length; i++) {
      sigBytes[i] = sigStr.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(encodedPayload));
    if (!isValid) return null;

    const payloadJson = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(payloadJson) as TokenPayload;

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Protected route groups
const protectedRoutes = ["/dashboard", "/orders", "/menu", "/settings", "/billing"];
const adminOnlyRoutes = ["/settings"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isProtected = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isLoginPage = pathname === "/login";

  let session: TokenPayload | null = null;
  if (token) {
    session = await verifyEdgeToken(token);
  }

  // 1. Unauthenticated access to protected routes
  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Role-Based Route Protection (RBAC)
  if (session && adminOnlyRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    if (session.role !== "ADMIN") {
      // Non-admins cannot access /settings
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 3. Already authenticated user trying to visit login page
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();

  // Inject security headers on every response
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/menu/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/login",
  ],
};
