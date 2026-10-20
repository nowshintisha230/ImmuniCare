"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { CATALOG, type VaccineType } from "@/lib/content/vaccine-catalog";
import { VACCINE_SLUGS } from "@/lib/content/vaccine-details";
import { VACCINES } from "@/lib/content/vaccine-info";
import { CATALOG_TEXT } from "@/lib/content/vaccine-sections";
import { Section } from "./section";
import { TypeSwitch } from "./type-switch";

export function ScheduleSection() {
  const { l } = useLanguage();
  const [type, setType] = useState<VaccineType>("government");
  const items = CATALOG.filter((v) => v.type === type);

  return (
    <Section id="schedule" title={CATALOG_TEXT.schedule.title} subtitle={CATALOG_TEXT.schedule.subtitle} muted>
      <TypeSwitch value={type} onChange={setType} />

      <div className="mx-auto max-w-3xl overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">{l(CATALOG_TEXT.labels.vaccine)}</th>
              <th className="px-4 py-3 font-semibold">{l(CATALOG_TEXT.labels.when)}</th>
              <th className="px-4 py-3 font-semibold">{l(CATALOG_TEXT.labels.doses)}</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ key, when, doses }) => (
              <tr key={key} className="border-t align-top">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/vaccines/${VACCINE_SLUGS[key]}`} className="hover:text-primary hover:underline">
                    {VACCINES[key].name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{l(when)}</td>
                <td className="px-4 py-3 text-muted-foreground">{l(doses)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mx-auto mt-5 max-w-3xl text-center text-sm text-muted-foreground">
        {l(CATALOG_TEXT.notes[type])}
      </p>
    </Section>
  );
}