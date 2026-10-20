"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH, fill } from "@/lib/content/dashboard";
import type { ChildView } from "@/lib/dashboard/types";

type Props = { items: ChildView[]; onReview: (childId: string) => void };

export function AttentionBanner({ items, onReview }: Props) {
  const { l } = useLanguage();

  const needing = items
    .map((child) => {
      const due = child.doses.filter((d) => d.status === "due");
      return {
        child,
        total: due.length,
        gov: due.filter((d) => d.type === "government").length,
        priv: due.filter((d) => d.type === "private").length,
      };
    })
    .filter((x) => x.total > 0);

  if (needing.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4">
      <h2 className="flex items-center gap-2 font-semibold text-destructive">
        <AlertTriangle className="size-5" />
        {l(DASH.attention.title)}
      </h2>

      {needing.map(({ child, total, gov, priv }) => {
        const noRecord = child.stats.completed === 0;
        const text = fill(l(noRecord ? DASH.attention.noRecord : DASH.attention.someRecord), {
          child: child.name,
          total,
          gov,
          priv,
        });
        return (
          <div key={child.id} className="flex flex-col gap-2 rounded-lg bg-background/70 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">{text}</p>
            <Button type="button" size="sm" className="shrink-0" onClick={() => onReview(child.id)}>
              {l(DASH.attention.review)}
            </Button>
          </div>
        );
      })}
    </div>
  );
}