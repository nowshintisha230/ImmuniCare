"use client";
import { RecordDownloadButton } from "./record-download-button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH, fill } from "@/lib/content/dashboard";
import type { ChildView } from "@/lib/dashboard/types";
import { formatDateKey } from "@/lib/format";
import { AddChildForm } from "./add-child-form";
import { ProgressBar } from "./progress-bar";

type Props = {
  items: ChildView[];
  onChange: () => void | Promise<void>;
  onAdded?: () => void | Promise<void>;
};

export function ChildrenTab({ items, onChange, onAdded }: Props) {
  const { t, l, language } = useLanguage();

  async function remove(child: ChildView) {
    if (!window.confirm(l(DASH.children.deleteConfirm))) return;
    try {
      const res = await fetch(`/api/children/${child.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success(l(DASH.children.deleted));
      await onChange();
    } catch {
      toast.error(t("error.generic"));
    }
  }

  function ageText(months: number) {
    return months < 24
      ? fill(l(DASH.children.months), { n: months })
      : fill(l(DASH.children.years), { n: Math.floor(months / 12) });
  }

  return (
    <div className="flex flex-col gap-6">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{l(DASH.children.empty)}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((child) => (
            <Card key={child.id}>
              <CardContent className="flex flex-col gap-3 pt-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{child.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ageText(child.ageMonths)} · {fill(l(DASH.children.born), { date: formatDateKey(child.dateOfBirth, language) })}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <RecordDownloadButton childId={child.id} compact />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={l(DASH.children.delete)}
                      onClick={() => remove(child)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <ProgressBar value={child.stats.percent} />
                <p className="text-xs text-muted-foreground">
                  {fill(l(DASH.overview.doses), { done: child.stats.completed, total: child.stats.total - child.stats.missed })} ({child.stats.percent}%)
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <AddChildForm onAdded={onAdded ?? onChange} />
    </div>
  );
}