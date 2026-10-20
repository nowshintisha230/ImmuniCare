"use client";

import { use, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/providers/language-provider";
import { useDashboard } from "@/hooks/use-dashboard";
import { useTodayKey } from "@/hooks/use-today";
import { DASH } from "@/lib/content/dashboard";
import { RECORD_TEXT } from "@/lib/content/record";
import { VACCINES } from "@/lib/content/vaccine-info";
import { formatAge, formatDateKey, formatDateLong } from "@/lib/format";
import { TOTALS, type DoseType } from "@/lib/vaccination/doses";
import { StatusBadge } from "./status-badge";

const SEX_KEY = { MALE: "auth.male", FEMALE: "auth.female", OTHER: "auth.other" } as const;
const TYPES: DoseType[] = ["government", "private"];

type Props = { params: Promise<{ childId: string }> };

export function RecordReport({ params }: Props) {
  const { childId } = use(params);
  const { t, l, language } = useLanguage();
  const { data, loading, error } = useDashboard();
  const todayKey = useTodayKey();
  const searchParams = useSearchParams();
  const autoPrint = searchParams.get("print") === "1";
  const printed = useRef(false);

  const child = data?.children.find((c) => c.id === childId);

  // open the print window once, after fonts (Bangla) are ready
  useEffect(() => {
    if (!autoPrint || !child || !todayKey || printed.current) return;
    printed.current = true;

    const run = async () => {
      try {
        await document.fonts.ready;
      } catch {
        // ignore
      }
      setTimeout(() => window.print(), 400);
    };
    run();
  }, [autoPrint, child, todayKey]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !data || !child) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-20 text-center">
        <p className="text-muted-foreground">{l(error ? DASH.loadFailed : RECORD_TEXT.notFound)}</p>
        <Link href="/dashboard" className="text-sm font-medium text-primary hover:underline">
          {l(RECORD_TEXT.back)}
        </Link>
      </div>
    );
  }

  const fmt = (key: string) => formatDateKey(key, language);
  const { stats } = child;

  const summary = [
    { label: DASH.stats.totalVaccines, value: TOTALS.vaccines.all },
    { label: DASH.stats.totalDoses, value: stats.total },
    { label: DASH.stats.completed, value: stats.completed },
    { label: DASH.stats.due, value: stats.due },
    { label: DASH.stats.upcoming, value: stats.upcoming },
  ];

  const info = [
    { label: t("auth.childName"), value: child.name },
    { label: t("auth.sex"), value: t(SEX_KEY[child.sex]) },
    { label: t("auth.dob"), value: formatDateLong(child.dateOfBirth, language) },
    { label: l(DASH.profile.age), value: formatAge(child.age, language) },
    { label: l(RECORD_TEXT.parent), value: data.user.name ?? data.user.email },
    { label: l(RECORD_TEXT.generated), value: todayKey ? fmt(todayKey) : "" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-6 print:bg-white print:p-0">
      <div className="no-print mx-auto mb-4 flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {l(RECORD_TEXT.back)}
        </Link>
        <Button type="button" onClick={() => window.print()}>
          <Download className="size-4" />
          {l(RECORD_TEXT.download)}
        </Button>
      </div>
      <p className="no-print mx-auto mb-4 max-w-4xl text-xs text-muted-foreground">{l(RECORD_TEXT.hint)}</p>

      <article className="print-exact mx-auto max-w-4xl rounded-xl border bg-card p-5 shadow-sm sm:p-8 print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <div className="mb-5 flex items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" />
            </span>
            <span className="text-lg font-bold">ImmuniCare</span>
          </div>
          <h1 className="text-right text-lg font-semibold sm:text-xl">{l(RECORD_TEXT.title)}</h1>
        </div>

        <section className="mb-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {l(RECORD_TEXT.child)}
          </h2>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {info.map(({ label, value }) => (
              <div key={label} className="flex gap-2 text-sm">
                <dt className="shrink-0 text-muted-foreground">{label}:</dt>
                <dd className="min-w-0 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {l(RECORD_TEXT.summary)}
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {summary.map(({ label, value }) => (
              <div key={label.en} className="rounded-lg border bg-muted/40 px-3 py-2">
                <p className="text-xl font-bold tabular-nums">{value}</p>
                <p className="text-xs text-muted-foreground">{l(label)}</p>
              </div>
            ))}
          </div>
        </section>

        {TYPES.map((type) => {
          const rows = child.doses.filter((d) => d.type === type);
          return (
            <section key={type} className="mb-6 break-inside-avoid-page">
              <h2 className="mb-2 font-semibold">{l(RECORD_TEXT[type])}</h2>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full border-collapse text-sm">
                  <thead className="[display:table-header-group]">
                    <tr className="border-b bg-muted/60 text-left">
                      <th className="px-3 py-2 font-semibold">{l(RECORD_TEXT.vaccine)}</th>
                      <th className="px-3 py-2 font-semibold">{l(RECORD_TEXT.dose)}</th>
                      <th className="px-3 py-2 font-semibold">{l(RECORD_TEXT.dueDate)}</th>
                      <th className="px-3 py-2 font-semibold">{l(RECORD_TEXT.status)}</th>
                      <th className="px-3 py-2 font-semibold">{l(RECORD_TEXT.givenOn)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((d) => (
                      <tr key={d.code} className="break-inside-avoid border-b last:border-b-0">
                        <td className="px-3 py-2 font-medium">
                          {d.name}
                          <span className="block text-xs font-normal text-muted-foreground">
                            {l(VACCINES[d.vaccine].protects)}
                          </span>
                        </td>
                        <td className="px-3 py-2">{d.doseNumber}</td>
                        <td className="whitespace-nowrap px-3 py-2">{fmt(d.dueDate)}</td>
                        <td className="px-3 py-2">
                          <StatusBadge status={d.status} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">{d.givenAt ? fmt(d.givenAt) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        <p className="border-t pt-4 text-xs text-muted-foreground">{l(RECORD_TEXT.disclaimer)}</p>
      </article>
    </div>
  );
}