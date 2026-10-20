"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { CATALOG } from "@/lib/content/vaccine-catalog";
import { DETAIL_TEXT, VACCINE_DETAILS } from "@/lib/content/vaccine-details";
import { VACCINES, type VaccineKey } from "@/lib/content/vaccine-info";
import { CATALOG_TEXT } from "@/lib/content/vaccine-sections";
import { cn } from "@/lib/utils";

export function VaccineDetail({ vaccineKey }: { vaccineKey: VaccineKey }) {
  const { l } = useLanguage();
  const entry = CATALOG.find((v) => v.key === vaccineKey);
  if (!entry) return null;

  const vaccine = VACCINES[vaccineKey];
  const detail = VACCINE_DETAILS[vaccineKey];
  const Icon = entry.icon;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-8">
      <Link
        href="/#categories"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {l(DETAIL_TEXT.back)}
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-full",
                entry.type === "government" ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600",
              )}
            >
              <Icon className="size-7" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-2xl">{vaccine.name}</CardTitle>
                <Badge variant="secondary">{l(CATALOG_TEXT.badge[entry.type])}</Badge>
              </div>
              <p className="mt-1 text-muted-foreground">{l(vaccine.protects)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <section>
            <h2 className="mb-1 font-semibold">{l(DETAIL_TEXT.about)}</h2>
            <p className="text-sm text-muted-foreground">{l(detail.about)}</p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold">{l(DETAIL_TEXT.facts)}</h2>
            <dl className="grid gap-3 sm:grid-cols-3">
              {[
                { label: CATALOG_TEXT.labels.when, value: entry.when },
                { label: CATALOG_TEXT.labels.doses, value: entry.doses },
                { label: DETAIL_TEXT.how, value: detail.route },
              ].map(({ label, value }) => (
                <div key={label.en} className="rounded-lg bg-muted/60 p-3">
                  <dt className="text-xs text-muted-foreground">{l(label)}</dt>
                  <dd className="mt-1 text-sm font-medium">{l(value)}</dd>
                </div>
              ))}
            </dl>
            {entry.note && <p className="mt-3 text-xs text-muted-foreground">{l(entry.note)}</p>}
          </section>
        </CardContent>
      </Card>

      <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        {l(CATALOG_TEXT.notes[entry.type])}
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{l(DETAIL_TEXT.sideEffects)}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {detail.sideEffects.map((s) => (
              <li key={s.en}>{l(s)}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{l(DETAIL_TEXT.cautions)}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {detail.cautions.map((s) => (
              <li key={s.en}>{l(s)}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <h2 className="mb-2 flex items-center gap-2 font-semibold text-destructive">
          <AlertTriangle className="size-4" />
          {l(DETAIL_TEXT.urgentTitle)}
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {DETAIL_TEXT.urgent.map((s) => (
            <li key={s.en}>{l(s)}</li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted-foreground">{l(DETAIL_TEXT.disclaimer)}</p>

      <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-fit")}>
        {l(DETAIL_TEXT.track)}
      </Link>
    </div>
  );
}