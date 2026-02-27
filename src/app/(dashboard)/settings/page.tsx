import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm font-medium">Name</p>
            <p className="text-sm text-muted-foreground">{session.user.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
