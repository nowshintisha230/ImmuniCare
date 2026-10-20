"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { EPI_SCHEDULE } from "@/lib/content/epi-schedule";
import { SECTIONS } from "@/lib/content/home";
import { Section } from "./section";

export function ScheduleSection() {
  const { l } = useLanguage();
  return (
    <Section id="schedule" title={SECTIONS.schedule.title} subtitle={SECTIONS.schedule.subtitle} muted>
      <div className="grid gap-4 md:grid-cols-2">
        {EPI_SCHEDULE.map((stage) => (
          <Card key={stage.id}>
            <CardHeader>
              <CardTitle className="text-lg">{l(stage.age)}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {stage.vaccines.map((v) => (
                <div key={v.name} className="flex items-start gap-3">
                  <Badge className="mt-0.5 shrink-0">{v.name}</Badge>
                  <p className="text-sm text-muted-foreground">{l(v.protects)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
        {l(SECTIONS.schedule.note)}
      </p>
    </Section>
  );
}