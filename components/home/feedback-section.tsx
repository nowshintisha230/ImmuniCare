"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { Stars } from "@/components/feedback/stars";
import { useLanguage } from "@/components/providers/language-provider";
import { FEEDBACK_TEXT, SECTIONS } from "@/lib/content/home";
import { Section } from "./section";

type Item = { id: string; name: string; rating: number; message: string };

export function FeedbackSection() {
  const { l } = useLanguage();
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => (r.ok ? r.json() : []))
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  return (
    <Section id="feedback" title={SECTIONS.feedback.title} subtitle={SECTIONS.feedback.subtitle}>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          {loaded && items.length === 0 && (
            <p className="text-sm text-muted-foreground">{l(FEEDBACK_TEXT.empty)}</p>
          )}
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-2 pt-6">
                <Stars value={item.rating} />
                <p className="text-sm">{item.message}</p>
                <p className="text-xs font-medium text-muted-foreground">{item.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <FeedbackForm />
      </div>
    </Section>
  );
}