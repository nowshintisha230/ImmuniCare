"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { GOVERNMENT_SCHEDULE, PRIVATE_SCHEDULE } from "@/lib/content/epi-schedule";
import type { VaccineType } from "@/lib/content/vaccine-catalog";
import { VACCINES } from "@/lib/content/vaccine-info";
import { CATALOG_TEXT } from "@/lib/content/vaccine-sections";
import { cn } from "@/lib/utils";
import { Section } from "./section";
import { TypeSwitch } from "./type-switch";

export function ScheduleSection() {
  const { l } = useLanguage();
  const [type, setType] = useState<VaccineType>("government");
  const stages = type === "government" ? GOVERNMENT_SCHEDULE : PRIVATE_SCHEDULE;

  return (
    <Section id="schedule" title={CATALOG_TEXT.schedule.title} subtitle={CATALOG_TEXT.schedule.subtitle} muted>
      <TypeSwitch value={type} onChange={setType} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stages.map((stage) => (
          <Card
            key={stage.id}
            className={cn("border-l-4", type === "government" ? "border-l-[#006a4e]" : "border-l-amber-500")}
          >
            <CardHeader>
              <CardTitle className="text-lg">{l(stage.age)}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {stage.items.map(({ key, detail }) => (
                <div key={key} className="flex items-start gap-3">
                  <Badge
                    className={cn("mt-0.5 shrink-0", type === "private" && "bg-amber-500 text-white hover:bg-amber-500")}
                  >
                    {VACCINES[key].name}
                  </Badge>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">{l(VACCINES[key].protects)}</p>
                    {detail && <p className="mt-0.5 text-xs font-medium">{l(detail)}</p>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-muted-foreground">
        {l(CATALOG_TEXT.notes[type])}
      </p>
    </Section>
  );
}