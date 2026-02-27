"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTimeID } from "@/lib/format";

type TokenRecord = {
  id: string;
  token: string;
  expiresAt: string;
  usedAt: string | null;
  user: {
    email: string;
    name: string;
  };
};

type TokenResponse = {
  passwordResets: TokenRecord[];
  emailVerifications: TokenRecord[];
};

async function fetchTokens(): Promise<TokenResponse> {
  const response = await fetch("/api/dev/tokens", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Tidak bisa mengambil token.");
  }
  return response.json();
}

function copy(value: string) {
  navigator.clipboard.writeText(value);
  toast.success("Token copied");
}

export function DevTokensPanel() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dev-tokens"],
    queryFn: fetchTokens,
    refetchInterval: 10_000,
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading tokens...</p>;
  }

  if (error || !data) {
    return <p className="text-sm text-destructive">Gagal memuat token. Pastikan aplikasi berjalan di mode development.</p>;
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-heading text-lg font-semibold">Password Reset Tokens</h2>
        <div className="mt-3 space-y-3">
          {data.passwordResets.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada token reset password.</p>
          ) : (
            data.passwordResets.map((item) => (
              <article key={item.id} className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">{item.user.email}</p>
                  <Badge variant={item.usedAt ? "secondary" : "default"}>{item.usedAt ? "Used" : "Active"}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Expires: {formatDateTimeID(item.expiresAt)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => copy(item.token)}>
                    <Copy className="mr-1 size-3" /> Copy token
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/auth/reset-password?token=${item.token}`}>
                      Open reset page
                      <ExternalLink className="ml-1 size-3" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-lg font-semibold">Email Verification Tokens</h2>
        <div className="mt-3 space-y-3">
          {data.emailVerifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada token verifikasi email.</p>
          ) : (
            data.emailVerifications.map((item) => (
              <article key={item.id} className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">{item.user.email}</p>
                  <Badge variant={item.usedAt ? "secondary" : "default"}>{item.usedAt ? "Used" : "Active"}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Expires: {formatDateTimeID(item.expiresAt)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => copy(item.token)}>
                    <Copy className="mr-1 size-3" /> Copy token
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/auth/verify-email?token=${item.token}`}>
                      Verify email
                      <ExternalLink className="ml-1 size-3" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
