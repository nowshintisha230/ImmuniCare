"use client";

import { SECTIONS, WHY_FEATURES } from "@/lib/content/home";
import { IconCard } from "./icon-card";
import { Section } from "./section";

export function WhySection() {
  return (
    <Section id="why" title={SECTIONS.why.title} subtitle={SECTIONS.why.subtitle}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_FEATURES.map((f) => (
          <IconCard key={f.title.en} {...f} />
        ))}
      </div>
    </Section>
  );
}