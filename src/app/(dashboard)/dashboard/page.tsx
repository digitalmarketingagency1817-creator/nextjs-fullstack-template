import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { trpc, getQueryClient } from "@/trpc/server";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.post.list.queryOptions({ limit: 10 }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}!</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-muted-foreground">
            Your dashboard is ready. Start building your app!
          </p>
        </div>
      </div>
    </HydrationBoundary>
  );
}
