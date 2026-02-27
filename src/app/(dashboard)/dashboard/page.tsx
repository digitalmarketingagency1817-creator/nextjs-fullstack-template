import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { QueryBoundary } from "@/components/shared/query-error-boundary";
import { PostListSkeleton } from "@/components/shared/loading-skeleton";
import { PostList } from "@/components/dashboard/post-list";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  prefetch(trpc.post.list.queryOptions({ limit: 10 }));

  return (
    <HydrateClient>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}!</p>
        </div>

        <QueryBoundary loadingFallback={<PostListSkeleton />}>
          <PostList limit={10} />
        </QueryBoundary>
      </div>
    </HydrateClient>
  );
}
