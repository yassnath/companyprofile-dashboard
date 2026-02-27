import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveDatabaseUrl() {
  const directCandidates = [
    process.env.DATABASE_URL,
    process.env.PRISMA_DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NON_POOLING,
  ];

  const direct = directCandidates.find((value) => Boolean(value));
  if (direct) {
    return direct;
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (!value) {
      continue;
    }

    const normalized = key.toUpperCase();
    if (normalized.endsWith("_PRISMA_DATABASE_URL")) {
      return value;
    }
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (!value) {
      continue;
    }

    const normalized = key.toUpperCase();
    if (normalized.endsWith("_DATABASE_URL")) {
      return value;
    }
  }

  return undefined;
}

const resolvedDatabaseUrl = resolveDatabaseUrl();
if (!process.env.DATABASE_URL && resolvedDatabaseUrl) {
  process.env.DATABASE_URL = resolvedDatabaseUrl;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
