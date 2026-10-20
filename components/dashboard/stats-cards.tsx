"use client";

import { AlertCircle, Baby, CalendarClock, CheckCircle2, Layers, Syringe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH } from "@/lib/content/dashboard";
import type { DashboardData } from "@/lib/dashboard/types";

export function StatsCards({ summary }: { summary: DashboardData["summary"] }) {
  const { l } = useLanguage();

  const items = [
    { label: DASH.stats.children, value: summary.children, icon: Baby },
    { label: DASH.stats.totalVaccines, value: summary.totalVaccines, icon: Syringe },
    { label: DASH.stats.totalDoses, value: summary.total, icon: Layers },
    { label: DASH.stats.completed, value: summary.completed, icon: CheckCircle2 },
    { label: DASH.stats.due, value: summary.due, icon: AlertCircle },
    { label: DASH.stats.upcoming, value: summary.upcoming, icon: CalendarClock },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {items.map(({ label, value, icon: Icon }) => (
        <Card key={label.en}>
          <CardContent className="flex flex-col gap-2 pt-6">
            <Icon className="size-5 text-primary" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{l(label)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}