"use client";
import { RecordDownloadButton } from "./record-download-button";
import { CalendarClock, CheckCircle2, Clock, Layers, Syringe } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH, fill } from "@/lib/content/dashboard";
import type { ChildView } from "@/lib/dashboard/types";
import { formatAge } from "@/lib/format";
import { TOTALS } from "@/lib/vaccination/doses";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./progress-bar";

type TileProps = {
  icon: LucideIcon;
  label: string;
  value: number;
  sub?: string;
  className: string;
};

function Tile({ icon: Icon, label, value, sub, className }: TileProps) {
  return (
    <div className={cn("flex flex-col gap-1 rounded-xl p-3", className)}>
      <Icon className="size-4" />
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-xs font-medium">{label}</p>
      {sub && <p className="text-[11px] opacity-70">{sub}</p>}
    </div>
  );
}

export function ChildOverviewCard({ child }: { child: ChildView }) {
  const { l, language } = useLanguage();
  const { stats } = child;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            {(child.name.trim()[0] ?? "?").toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold">{child.name}</p>
            <p className="text-xs text-muted-foreground">
              {fill(l(DASH.overview.ageLine), { age: formatAge(child.age, language) })}
            </p>
          </div>
          <RecordDownloadButton childId={child.id} compact />
          <p className="text-2xl font-bold text-primary">{stats.percent}%</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <ProgressBar value={stats.percent} />
          <p className="text-xs text-muted-foreground">
            {fill(l(DASH.overview.doses), { done: stats.completed, total: stats.total - stats.missed })}
          </p>
        </div>

                <div className="grid grid-cols-6 gap-2 sm:gap-3 lg:grid-cols-5">
          <Tile
            icon={Syringe}
            label={l(DASH.stats.totalVaccines)}
            value={TOTALS.vaccines.all}
            sub={fill(l(DASH.breakdown), { gov: TOTALS.vaccines.government, priv: TOTALS.vaccines.private })}
            className="col-span-3 bg-muted text-foreground lg:col-span-1"
          />
          <Tile
            icon={Layers}
            label={l(DASH.stats.totalDoses)}
            value={stats.total}
            sub={fill(l(DASH.breakdown), { gov: TOTALS.doses.government, priv: TOTALS.doses.private })}
            className="col-span-3 bg-muted text-foreground lg:col-span-1"
          />
          <Tile
            icon={CheckCircle2}
            label={l(DASH.stats.completed)}
            value={stats.completed}
            className="col-span-2 bg-emerald-50 text-emerald-800 lg:col-span-1 dark:bg-emerald-950/40 dark:text-emerald-300"
          />
          <Tile
            icon={Clock}
            label={l(DASH.stats.due)}
            value={stats.due}
            className="col-span-2 bg-red-50 text-red-800 lg:col-span-1 dark:bg-red-950/40 dark:text-red-300"
          />
          <Tile
            icon={CalendarClock}
            label={l(DASH.stats.upcoming)}
            value={stats.upcoming}
            className="col-span-2 bg-sky-50 text-sky-800 lg:col-span-1 dark:bg-sky-950/40 dark:text-sky-300"
          />
        </div>

        {stats.missed > 0 && (
          <p className="text-xs text-muted-foreground">{fill(l(DASH.overview.missedNote), { n: stats.missed })}</p>
        )}
      </CardContent>
    </Card>
  );
}