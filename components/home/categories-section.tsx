"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { CATALOG, type VaccineType } from "@/lib/content/vaccine-catalog";
import { CATALOG_TEXT } from "@/lib/content/vaccine-sections";
import { VACCINES } from "@/lib/content/vaccine-info";
import { cn } from "@/lib/utils";
import { Section } from "./section";
import { TypeSwitch } from "./type-switch";

export function CategoriesSection() {
  const { l } = useLanguage();
  const [type, setType] = useState<VaccineType>("government");
  const items = CATALOG.filter((v) => v.type === type);

  return (
    <Section id="categories" title={CATALOG_TEXT.categories.title} subtitle={CATALOG_TEXT.categories.subtitle}>
      <TypeSwitch value={type} onChange={setType} />

      <p
        className={cn(
          "mx-auto mb-8 max-w-3xl rounded-lg border px-4 py-3 text-center text-sm",
          type === "government"
            ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
            : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
        )}
      >
        {l(CATALOG_TEXT.notes[type])}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map(({ number, key, icon: Icon, when, doses, note }) => {
          const vaccine = VACCINES[key];
          return (
            <Card key={key} className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full",
                      type === "government" ? "bg-[#006a4e]/10 text-[#006a4e] dark:text-emerald-400" : "bg-amber-500/10 text-amber-600",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">#{number}</span>
                </div>
                <CardTitle className="text-lg">{vaccine.name}</CardTitle>
                <CardDescription>{l(vaccine.protects)}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <Badge variant="secondary" className="w-fit">{l(CATALOG_TEXT.badge[type])}</Badge>
                <p>
                  <span className="text-muted-foreground">{l(CATALOG_TEXT.labels.when)}: </span>
                  {l(when)}
                </p>
                <p>
                  <span className="text-muted-foreground">{l(CATALOG_TEXT.labels.doses)}: </span>
                  {l(doses)}
                </p>
                {note && <p className="text-xs text-muted-foreground">{l(note)}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}