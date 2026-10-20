"use client";

import { Baby, Bell, CalendarCheck, LayoutDashboard, MessageSquare, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH } from "@/lib/content/dashboard";
import { cn } from "@/lib/utils";

export const TABS = ["overview", "schedule", "notifications", "children", "feedback", "profile"] as const;
export type Tab = (typeof TABS)[number];

export function isTab(value: string | null): value is Tab {
  return value !== null && (TABS as readonly string[]).includes(value);
}

const ICONS: Record<Tab, LucideIcon> = {
  overview: LayoutDashboard,
  schedule: CalendarCheck,
  notifications: Bell,
  children: Baby,
  feedback: MessageSquare,
  profile: UserRound,
};

type Props = { value: Tab; onChange: (tab: Tab) => void; notificationCount: number };

export function DashboardNav({ value, onChange, notificationCount }: Props) {
  const { l } = useLanguage();

  return (
    <nav
      aria-label={l(DASH.title)}
      className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-20 lg:flex-col lg:gap-1 lg:overflow-visible lg:rounded-xl lg:border lg:bg-card lg:p-2 lg:pb-2"
    >
      {TABS.map((tab) => {
        const Icon = ICONS[tab];
        const active = tab === value;
        return (
          <button
            key={tab}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onChange(tab)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors lg:w-full lg:border-transparent",
              active
                ? "border-primary bg-primary font-bold text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground lg:bg-transparent",
            )}
          >
            <Icon className="size-4" />
            <span className="whitespace-nowrap">{l(DASH.tabs[tab])}</span>
            {tab === "notifications" && notificationCount > 0 && (
              <span
                className={cn(
                  "ml-auto min-w-5 rounded-full px-1.5 text-center text-xs font-semibold",
                  active ? "bg-white/25 text-primary-foreground" : "bg-destructive text-white",
                )}
              >
                {notificationCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}