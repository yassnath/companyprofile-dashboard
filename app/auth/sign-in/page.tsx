import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Sign In",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;

  return (
    <Card className="auth-card">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Sign in</CardTitle>
        <CardDescription>Masuk untuk membuat dan mengelola order layanan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <SignInForm callbackUrl={params.callbackUrl} />
        <Separator />
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-chart-2/10 p-4 text-sm">
          <p className="font-semibold">Demo Accounts</p>
          <div className="mt-2 space-y-2 text-muted-foreground">
            <p>
              User: <span className="font-medium text-foreground">user@solvix.studio</span>
            </p>
            <p>
              Admin: <span className="font-medium text-foreground">admin@solvix.studio</span>
            </p>
            <p>
              Password: <span className="font-medium text-foreground">Solvix123!</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
