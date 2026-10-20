"use client";

import { AlertTriangle, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH, fill } from "@/lib/content/dashboard";
import type { NotificationView } from "@/lib/dashboard/types";
import { formatDateKey } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = { items: NotificationView[]; limit?: number };

export function NotificationList({ items, limit }: Props) {
  const { l, language } = useLanguage();
  const shown = limit ? items.slice(0, limit) : items;

  if (shown.length === 0) {
    return <p className="text-sm text-muted-foreground">{l(DASH.notifications.empty)}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {shown.map((n) => {
        if (n.kind === "overdue") {
          const template = n.doseType === "government" ? DASH.notifications.overdueGov : DASH.notifications.overduePriv;
          const text = fill(l(template), {
            child: n.childName,
            count: n.count,
            vaccines: n.vaccines.join(", "),
          });
          return (
            <li
              key={n.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 text-sm",
                n.doseType === "government" ? "border-destructive/40 bg-destructive/5" : "border-amber-300/60 bg-amber-50 dark:bg-amber-950/30",
              )}
            >
              <AlertTriangle
                className={cn("mt-0.5 size-4 shrink-0", n.doseType === "government" ? "text-destructive" : "text-amber-600")}
              />
              <p>{text}</p>
            </li>
          );
        }

        const template = n.daysUntil === 0 ? DASH.notifications.today : DASH.notifications.soon;
        const text = fill(l(template), {
          vaccine: n.vaccine,
          n: n.doseNumber,
          child: n.childName,
          days: n.daysUntil,
        });
        return (
          <li key={n.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
            <Bell className={cn("mt-0.5 size-4 shrink-0", n.daysUntil === 0 ? "text-destructive" : "text-primary")} />
            <div className="min-w-0">
              <p>
                {text}{" "}
                {n.optional && <Badge variant="outline" className="ml-1 align-middle text-[10px]">{l(DASH.notifications.optional)}</Badge>}
              </p>
              <p className="text-xs text-muted-foreground">{formatDateKey(n.dueDate, language)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}