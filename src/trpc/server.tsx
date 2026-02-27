import "server-only";

import { createTRPCOptionsProxy, type TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cache, Suspense } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";
import { LoadingFallback } from "@/components/shared/loading-fallback";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

interface HydrateClientProps {
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
  loadingMessage?: string;
}

export function HydrateClient({
  children,
  loadingFallback,
  loadingMessage = "Loading...",
}: HydrateClientProps) {
  const queryClient = getQueryClient();

  const fallback = loadingFallback || <LoadingFallback message={loadingMessage} />;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </HydrationBoundary>
  );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
