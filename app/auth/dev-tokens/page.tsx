import { notFound } from "next/navigation";

import { DevTokensPanel } from "@/components/auth/dev-tokens-panel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Dev Tokens",
};

export const dynamic = "force-dynamic";

export default function DevTokensPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <Card className="auth-card">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Development Tokens</CardTitle>
        <CardDescription>
          Simulasi provider email: token reset password dan verifikasi email ditampilkan di sini.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DevTokensPanel />
      </CardContent>
    </Card>
  );
}
