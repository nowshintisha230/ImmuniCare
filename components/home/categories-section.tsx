"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { SECTIONS } from "@/lib/content/home";
import { VACCINE_CATEGORIES } from "@/lib/content/vaccine-categories";
import { Section } from "./section";

export function CategoriesSection() {
  const { l } = useLanguage();
  return (
    <Section id="categories" title={SECTIONS.categories.title} subtitle={SECTIONS.categories.subtitle}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VACCINE_CATEGORIES.map(({ id, icon: Icon, name, vaccines, when, description }) => (
          <Card key={id} className="h-full">
            <CardHeader>
              <span className="mb-2 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <CardTitle className="text-lg">{l(name)}</CardTitle>
              <CardDescription>{l(description)}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Badge variant="secondary" className="w-fit">{vaccines}</Badge>
              <p className="text-xs text-muted-foreground">{l(when)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}