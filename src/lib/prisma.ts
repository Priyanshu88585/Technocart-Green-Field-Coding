import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  const FALLBACK_B64 =
    "bW9uZ29kYitzcnY6Ly9wcml5YW5zaHVrZXNoYXJ3YW5pODg1ODU3X2RiX3VzZXI6RnVOVElGNVdoSjlqUzQ2R0BjbHVzdGVyMC53Mnd1c3J3Lm1vbmdvZGIubmV0L3Jlc3RhdXJhbnRfYmlsbGluZz9yZXRyeVdyaXRlcz10cnVlJnc9bWFqb3JpdHkmYXBwTmFtZT1DbHVzdGVyMA==";
  try {
    process.env.DATABASE_URL = atob(FALLBACK_B64);
  } catch {
    process.env.DATABASE_URL = Buffer.from(FALLBACK_B64, "base64").toString("utf-8");
  }
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

if (!globalForPrisma.prisma || !("user" in globalForPrisma.prisma)) {
  globalForPrisma.prisma = new PrismaClient();
}

export const prisma = globalForPrisma.prisma;
