"use client";

import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Suspense, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function QueryErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Card className="border-destructive/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-destructive h-5 w-5" />
          <CardTitle className="text-base">Failed to load</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button size="sm" variant="outline" onClick={resetErrorBoundary}>
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}

export function QueryBoundary({
  children,
  loadingFallback,
  errorFallback,
}: {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: React.ComponentType<FallbackProps>;
}) {
  return (
    <ErrorBoundary FallbackComponent={errorFallback ?? QueryErrorFallback}>
      <Suspense fallback={loadingFallback ?? null}>{children}</Suspense>
    </ErrorBoundary>
  );
}
