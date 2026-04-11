"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { aiSummarySchema, type AiSummaryInput } from "@/lib/validators";
import { useTRPC } from "@/trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const SAMPLE_TEXT = `Next.js 16 gives us a modern App Router foundation, while tRPC keeps the API fully type-safe from server to client. TanStack Query handles caching, suspense, and mutations without hand-rolled loading state. This template combines those pieces with Better Auth, Prisma, Inngest, and the Vercel AI SDK so teams can start from production-ready patterns instead of wiring everything from scratch.`;

export function AiSummaryLab() {
  const t = useTranslations("AiSummaryLab");
  const trpc = useTRPC();
  const [summary, setSummary] = useState<string | null>(null);

  const form = useForm<AiSummaryInput>({
    resolver: zodResolver(aiSummarySchema),
    defaultValues: {
      text: SAMPLE_TEXT,
    },
  });

  const summarize = useMutation(
    trpc.ai.summarize.mutationOptions({
      onSuccess: (data) => {
        setSummary(data.summary);
      },
      onError: (error) => {
        toast.error(error.message ?? t("errorFallback"));
      },
    })
  );

  const onSubmit = (data: AiSummaryInput) => {
    setSummary(null);
    summarize.mutate(data);
  };

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {t("title")}
            </CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <Badge variant="secondary">{t("badge")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("inputLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={9}
                      placeholder={t("inputPlaceholder")}
                      className="resize-none"
                    />
                  </FormControl>
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>{t("helper")}</span>
                    <span>{field.value.length}/5000</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={summarize.isPending}>
                {summarize.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  t("submit")
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={summarize.isPending}
                onClick={() => {
                  form.reset({ text: SAMPLE_TEXT });
                  setSummary(null);
                }}
              >
                {t("useSample")}
              </Button>
            </div>
          </form>
        </Form>

        <div className="bg-muted/40 space-y-2 rounded-lg border p-4">
          <p className="text-sm font-medium">{t("resultLabel")}</p>
          {summary ? (
            <p className="text-sm leading-6">{summary}</p>
          ) : (
            <p className="text-muted-foreground text-sm">{t("resultPlaceholder")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
