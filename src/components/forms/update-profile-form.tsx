"use client";

// Showcases: react-hook-form + zod, tRPC protectedProcedure mutation,
//            TanStack Query useMutation + cache invalidation via queryClient

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validators";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function UpdateProfileForm() {
  const t = useTranslations("SettingsPage");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // useSuspenseQuery — works with server-side HydrateClient prefetch
  const { data: user } = useSuspenseQuery(trpc.user.me.queryOptions());

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
    },
  });

  const updateProfile = useMutation(
    trpc.user.updateProfile.mutationOptions({
      onSuccess: (updated) => {
        // Reset form with fresh server data (marks fields as non-dirty)
        form.reset({ name: updated.name });
        // Invalidate user.me so any other subscriber (header, etc.) refreshes
        void queryClient.invalidateQueries({ queryKey: trpc.user.me.queryKey() });
        toast.success(t("updateSuccess"));
      },
      onError: (err) => {
        toast.error(err.message);
      },
    })
  );

  const onSubmit = (data: UpdateProfileInput) => {
    updateProfile.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("namePlaceholder")} {...field} />
              </FormControl>
              <FormDescription>{t("nameDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email is read-only — managed by Better Auth */}
        <FormItem>
          <FormLabel>{t("email")}</FormLabel>
          <Input value={user.email} disabled className="bg-muted/50" />
          <FormDescription>{t("emailDescription")}</FormDescription>
        </FormItem>

        <Button type="submit" disabled={updateProfile.isPending || !form.formState.isDirty}>
          {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {updateProfile.isPending ? t("updateSubmitting") : t("updateSubmit")}
        </Button>
      </form>
    </Form>
  );
}
