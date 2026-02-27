import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <Card className="auth-card">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Forgot password</CardTitle>
        <CardDescription>
          Minta token reset password. Di mode development, token dapat dilihat di halaman dev tokens.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ForgotPasswordForm />
        {process.env.NODE_ENV !== "production" ? (
          <p className="text-xs text-muted-foreground">
            Dev helper: <Link href="/auth/dev-tokens" className="text-primary hover:underline">Open Dev Tokens</Link>
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
