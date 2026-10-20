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

/** Desktop sidebar. On mobile the BottomNav is used instead. */
export function DashboardNav({ value, onChange, notificationCount }: Props) {
  const { l } = useLanguage();

  return (
    <nav
      aria-label={l(DASH.title)}
      className="hidden lg:sticky lg:top-20 lg:flex lg:flex-col lg:gap-1 lg:self-start lg:rounded-xl lg:border lg:bg-card lg:p-2"
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
              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary font-bold text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
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