import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = {
  title: "Sign Up",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;

  return (
    <Card className="auth-card">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Create account</CardTitle>
        <CardDescription>Daftar akun untuk mulai order layanan Solvix Studio.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm callbackUrl={params.callbackUrl} />
      </CardContent>
    </Card>
  );
}
