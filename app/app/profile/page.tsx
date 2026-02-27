import { ProfileForm } from "@/components/dashboard/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/session";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-muted-foreground">Kelola pengaturan akun Anda.</p>
      </div>

      <Card className="max-w-xl rounded-2xl">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Update informasi profil dasar Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm defaultName={user.name || ""} email={user.email || "-"} role={user.role || "USER"} />
        </CardContent>
      </Card>
    </div>
  );
}
