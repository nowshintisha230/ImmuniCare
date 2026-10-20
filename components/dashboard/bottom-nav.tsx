"use client";

import { Baby, CalendarCheck, LayoutDashboard, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import type { Localized } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import type { Tab } from "./dashboard-nav";

const ITEMS: { tab: Tab; icon: LucideIcon; label: Localized }[] = [
  { tab: "overview", icon: LayoutDashboard, label: { en: "Overview", bn: "সারসংক্ষেপ" } },
  { tab: "schedule", icon: CalendarCheck, label: { en: "Schedule", bn: "সময়সূচি" } },
  { tab: "children", icon: Baby, label: { en: "My child", bn: "আমার সন্তান" } },
  { tab: "feedback", icon: MessageSquare, label: { en: "Feedback", bn: "মতামত" } },
];

type Props = { value: Tab; onChange: (tab: Tab) => void };

export function BottomNav({ value, onChange }: Props) {
  const { l } = useLanguage();

  return (
    <nav
      aria-label="Dashboard"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-1.5">
        {ITEMS.map(({ tab, icon: Icon, label }) => {
          const active = tab === value;
          return (
            <li key={tab} className="flex-1">
              <button
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => onChange(tab)}
                className="flex w-full flex-col items-center gap-0.5 py-1 text-[11px]"
              >
                <span
                  className={cn(
                    "flex h-7 w-14 items-center justify-center rounded-full transition-all",
                    active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-[18px]" />
                </span>
                <span className={cn("leading-tight", active ? "font-bold text-primary" : "text-muted-foreground")}>
                  {l(label)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}