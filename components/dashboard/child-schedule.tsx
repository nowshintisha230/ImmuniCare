"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH, fill } from "@/lib/content/dashboard";
import { VACCINES } from "@/lib/content/vaccine-info";
import type { ChildView } from "@/lib/dashboard/types";
import { formatDateKey } from "@/lib/format";
import type { DoseType } from "@/lib/vaccination/doses";
import type { DoseStatus, DoseView } from "@/lib/vaccination/status";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./progress-bar";
import { StatusBadge } from "./status-badge";

type StatusFilter = "all" | DoseStatus;
type TypeFilter = "all" | DoseType;
type Props = {
  items: ChildView[];
  onChange: () => void | Promise<void>;
  initialChildId?: string;
  initialStatus?: StatusFilter;
};

export function ChildSchedule({ items, onChange, initialChildId, initialStatus = "all" }: Props) {
  const { t, l, language } = useLanguage();
  const [childId, setChildId] = useState(initialChildId ?? "");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>(initialStatus);
  const [type, setType] = useState<TypeFilter>("all");
  const [vaccine, setVaccine] = useState("all");
  const [marking, setMarking] = useState<string | null>(null);
  const [markDate, setMarkDate] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const child = items.find((c) => c.id === childId) ?? items[0];

  const vaccineKeys = useMemo(
    () => (child ? [...new Set(child.doses.map((d) => d.vaccine))] : []),
    [child],
  );

  const filtered = useMemo(() => {
    if (!child) return [];
    const q = query.trim().toLowerCase();
    return child.doses.filter((d) => {
      if (status !== "all" && d.status !== status) return false;
      if (type !== "all" && d.type !== type) return false;
      if (vaccine !== "all" && d.vaccine !== vaccine) return false;
      if (!q) return true;
      const info = VACCINES[d.vaccine];
      return [d.name, d.code, info.protects.en, info.protects.bn].some((s) => s.toLowerCase().includes(q));
    });
  }, [child, query, status, type, vaccine]);

  if (!child) {
    return <p className="text-sm text-muted-foreground">{l(DASH.children.empty)}</p>;
  }

  const fmt = (key: string) => formatDateKey(key, language);

  function note(d: DoseView) {
    if (d.status === "completed" && d.givenAt) return fill(l(DASH.schedule.givenOn), { date: fmt(d.givenAt) });
    if (d.status === "missed") return l(DASH.schedule.missedNote);
    if (d.daysUntil === 0) return l(DASH.schedule.dueToday);
    if (d.daysUntil < 0) return fill(l(DASH.schedule.overdueBy), { days: -d.daysUntil, date: fmt(d.dueDate) });
    return fill(l(DASH.schedule.dueIn), { days: d.daysUntil, date: fmt(d.dueDate) });
  }

  async function mark(code: string) {
    setBusy(code);
    try {
      const res = await fetch(`/api/children/${child.id}/vaccinations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doseCode: code, givenAt: markDate || undefined }),
      });
      if (res.status === 400) {
        toast.error(l(DASH.schedule.badDate));
        return;
      }
      if (!res.ok) throw new Error();
      toast.success(l(DASH.schedule.saved));
      setMarking(null);
      setMarkDate("");
      await onChange();
    } catch {
      toast.error(t("error.generic"));
    } finally {
      setBusy(null);
    }
  }

  async function undo(code: string) {
    setBusy(code);
    try {
      const res = await fetch(`/api/children/${child.id}/vaccinations?doseCode=${encodeURIComponent(code)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success(l(DASH.schedule.removed));
      await onChange();
    } catch {
      toast.error(t("error.generic"));
    } finally {
      setBusy(null);
    }
  }

  const chips: { value: StatusFilter; label: string; count: number }[] = [
    { value: "all", label: l(DASH.schedule.all), count: child.stats.total },
    { value: "due", label: l(DASH.status.due), count: child.stats.due },
    { value: "upcoming", label: l(DASH.status.upcoming), count: child.stats.upcoming },
    { value: "completed", label: l(DASH.status.completed), count: child.stats.completed },
    ...(child.stats.missed > 0
      ? [{ value: "missed" as const, label: l(DASH.status.missed), count: child.stats.missed }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            <NativeSelect
              aria-label={l(DASH.schedule.child)}
                            className="col-span-2 sm:col-span-1"
              value={child.id}
              onChange={(e) => {
                setChildId(e.target.value);
                setVaccine("all");
                setMarking(null);
              }}
            >
              {items.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </NativeSelect>
                       <div className="relative col-span-2 min-w-48 sm:col-span-1 sm:flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                value={query}
                placeholder={l(DASH.schedule.search)}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <NativeSelect
              aria-label={l(DASH.schedule.allTypes)}
              value={type}
              onChange={(e) => setType(e.target.value as TypeFilter)}
            >
              <option value="all">{l(DASH.schedule.allTypes)}</option>
              <option value="government">{l(DASH.type.government)}</option>
              <option value="private">{l(DASH.type.private)}</option>
            </NativeSelect>
            <NativeSelect
              aria-label={l(DASH.schedule.vaccinesLabel)}
              value={vaccine}
              onChange={(e) => setVaccine(e.target.value)}
            >
              <option value="all">{l(DASH.schedule.allVaccines)}</option>
              {vaccineKeys.map((k) => (
                <option key={k} value={k}>{VACCINES[k].name}</option>
              ))}
            </NativeSelect>
          </div>

                    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
            {chips.map((chip) => (
              <Button
                key={chip.value}
                type="button"
                size="sm"
                className="shrink-0"
                variant={status === chip.value ? "default" : "outline"}
                onClick={() => setStatus(chip.value)}
              >
                {chip.label} ({chip.count})
              </Button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <ProgressBar value={child.stats.percent} />
            <p className="text-xs text-muted-foreground">
              {fill(l(DASH.overview.doses), { done: child.stats.completed, total: child.stats.total - child.stats.missed })} ({child.stats.percent}%)
            </p>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">{l(DASH.schedule.none)}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((d) => (
            <li key={d.code} className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-medium">
                  {d.name} · {fill(l(DASH.schedule.dose), { n: d.doseNumber })}
                  <Badge variant="outline" className="text-[10px]">{l(DASH.type[d.type])}</Badge>
                </p>
                <p className="text-xs text-muted-foreground">{l(VACCINES[d.vaccine].protects)}</p>
                <p className={cn("mt-1 text-xs", d.status === "due" && "font-medium text-destructive")}>{note(d)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={d.status} />

                {d.status === "completed" ? (
                  <Button type="button" size="sm" variant="ghost" disabled={busy === d.code} onClick={() => undo(d.code)}>
                    {l(DASH.schedule.undo)}
                  </Button>
                ) : marking === d.code ? (
                  <>
                    <Input
                      type="date"
                      className="h-8 w-36"
                      aria-label={l(DASH.schedule.dateHint)}
                      title={l(DASH.schedule.dateHint)}
                      value={markDate}
                      onChange={(e) => setMarkDate(e.target.value)}
                    />
                    <Button type="button" size="sm" disabled={busy === d.code} onClick={() => mark(d.code)}>
                      {l(DASH.schedule.confirm)}
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setMarking(null)}>
                      {l(DASH.schedule.cancel)}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setMarking(d.code);
                      setMarkDate("");
                    }}
                  >
                    {l(DASH.schedule.markGiven)}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}