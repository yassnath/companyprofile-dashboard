import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Verify Email",
};

export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;

  let success = false;
  let message = "Token verifikasi tidak tersedia.";

  if (params.token) {
    const record = await prisma.emailVerificationToken.findUnique({ where: { token: params.token } });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      success = false;
      message = "Token verifikasi tidak valid atau sudah kedaluwarsa.";
    } else {
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
      success = true;
      message = "Email berhasil diverifikasi.";
    }
  }

  return (
    <Card className="auth-card">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Verify email</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full rounded-xl">
          <Link href={success ? "/auth/sign-in" : "/auth/dev-tokens"}>{success ? "Go to Sign In" : "Open Dev Tokens"}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
