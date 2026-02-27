"use server";

import { hash } from "bcryptjs";
import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { createSecureToken, expiryFromNow } from "@/lib/tokens";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signUpSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type SignUpInput,
} from "@/lib/validations";

type ActionResult = {
  success: boolean;
  message: string;
};

async function getRateKey(prefix: string, identity: string) {
  const headerBag = await headers();
  const ip = getClientIp(headerBag);
  return `${prefix}:${identity}:${ip}`;
}

export async function registerUserAction(input: SignUpInput): Promise<ActionResult & { token?: string }> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Input tidak valid",
    };
  }

  const limiter = rateLimit(await getRateKey("auth:signup", parsed.data.email), 5, 60_000);
  if (!limiter.allowed) {
    return {
      success: false,
      message: "Terlalu banyak percobaan pendaftaran. Coba lagi dalam 1 menit.",
    };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return {
      success: false,
      message: "Email sudah terdaftar.",
    };
  }

  const passwordHash = await hash(parsed.data.password, 12);
  const token = createSecureToken();

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    },
  });

  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: expiryFromNow(24),
    },
  });

  return {
    success: true,
    message: "Akun berhasil dibuat. Silakan login.",
    token,
  };
}

export async function requestPasswordResetAction(
  input: ForgotPasswordInput,
): Promise<ActionResult & { token?: string }> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Input tidak valid",
    };
  }

  const limiter = rateLimit(await getRateKey("auth:forgot", parsed.data.email), 5, 60_000);
  if (!limiter.allowed) {
    return {
      success: false,
      message: "Terlalu banyak request reset password. Coba lagi sebentar.",
    };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (!user) {
    return {
      success: true,
      message: "Jika email terdaftar, token reset akan tersedia di halaman dev tokens.",
    };
  }

  const token = createSecureToken();

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: expiryFromNow(1),
    },
  });

  return {
    success: true,
    message: "Token reset dibuat. Buka halaman dev tokens untuk melanjutkan.",
    token,
  };
}

export async function resetPasswordAction(input: ResetPasswordInput): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Input tidak valid",
    };
  }

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token: parsed.data.token },
    include: { user: true },
  });

  if (!tokenRecord || tokenRecord.usedAt || tokenRecord.expiresAt < new Date()) {
    return {
      success: false,
      message: "Token reset tidak valid atau sudah kedaluwarsa.",
    };
  }

  const newHash = await hash(parsed.data.password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { passwordHash: newHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return {
    success: true,
    message: "Password berhasil diubah. Silakan login.",
  };
}

export async function verifyEmailAction(token: string): Promise<ActionResult> {
  if (!token) {
    return {
      success: false,
      message: "Token verifikasi tidak tersedia.",
    };
  }

  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return {
      success: false,
      message: "Token verifikasi tidak valid atau sudah kedaluwarsa.",
    };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return {
    success: true,
    message: "Email berhasil diverifikasi.",
  };
}
