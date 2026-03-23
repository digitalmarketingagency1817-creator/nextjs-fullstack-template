// Showcases: HydrateClient + prefetch pattern for server-side data hydration,
//            Suspense with Skeleton fallback, UpdateProfileForm with tRPC mutation

import { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/server/auth";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { UpdateProfileForm } from "@/components/forms/update-profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SettingsPage");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

function ProfileFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-10 w-28" />
    </div>
  );
}

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("SettingsPage");

  if (!session) redirect("/sign-in");

  // Prefetch user profile — hydrates client before render (standard HydrateClient pattern)
  prefetch(trpc.user.me.queryOptions());

  return (
    <HydrateClient>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>{t("profileTitle")}</CardTitle>
            <CardDescription>{t("profileDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Suspense ensures skeleton shows during hydration */}
            <Suspense fallback={<ProfileFormSkeleton />}>
              <UpdateProfileForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </HydrateClient>
  );
}
