"use client";

import { Bell } from "lucide-react";
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
            <div>
              <p>{text}</p>
              <p className="text-xs text-muted-foreground">{formatDateKey(n.dueDate, language)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}