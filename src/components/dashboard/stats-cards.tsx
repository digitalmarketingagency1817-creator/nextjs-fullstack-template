"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Users, Flame } from "lucide-react";

export function StatsCards() {
  const trpc = useTRPC();
  // Data is always available — prefetched and hydrated from server
  const { data } = useSuspenseQuery(trpc.stats.dashboard.queryOptions());

  const cards = [
    {
      title: "Total Posts",
      value: data.totalPosts,
      description: "Posts you've published",
      icon: FileText,
    },
    {
      title: "This Week",
      value: data.recentPosts,
      description: "Posts in the last 7 days",
      icon: TrendingUp,
    },
    {
      title: "Community",
      value: data.totalUsers,
      description: "Registered members",
      icon: Users,
    },
    {
      title: "Active Days",
      value: data.activeDaysThisWeek,
      description: "Days with posts this week",
      icon: Flame,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-muted-foreground text-xs">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
