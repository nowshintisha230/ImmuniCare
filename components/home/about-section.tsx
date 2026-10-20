"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { ABOUT, SECTIONS } from "@/lib/content/home";
import { Section } from "./section";

export function AboutSection() {
  const { l } = useLanguage();
  return (
    <Section id="about" title={SECTIONS.about.title} muted>
      <div className="mx-auto flex max-w-2xl flex-col gap-4 text-center text-muted-foreground">
        {ABOUT.paragraphs.map((p) => (
          <p key={p.en}>{l(p)}</p>
        ))}
      </div>
    </Section>
  );
}