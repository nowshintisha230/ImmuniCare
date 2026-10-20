"use client";

import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH } from "@/lib/content/dashboard";
import type { DoseStatus } from "@/lib/vaccination/status";
import { cn } from "@/lib/utils";

const STYLES: Record<DoseStatus, string> = {
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  due: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  upcoming: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  missed: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: DoseStatus }) {
  const { l } = useLanguage();
  return (
    <Badge variant="outline" className={cn("border-transparent", STYLES[status])}>
      {l(DASH.status[status])}
    </Badge>
  );
}