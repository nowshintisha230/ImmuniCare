"use client";

import { HOW_STEPS, SECTIONS } from "@/lib/content/home";
import { IconCard } from "./icon-card";
import { Section } from "./section";

export function HowSection() {
  return (
    <Section id="how" title={SECTIONS.how.title} subtitle={SECTIONS.how.subtitle} muted>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_STEPS.map((s, i) => (
          <IconCard key={s.title.en} {...s} step={i + 1} />
        ))}
      </div>
    </Section>
  );
}