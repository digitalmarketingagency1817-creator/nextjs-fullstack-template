"use client";

import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <TRPCReactProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </TRPCReactProvider>
    </NuqsAdapter>
  );
}
