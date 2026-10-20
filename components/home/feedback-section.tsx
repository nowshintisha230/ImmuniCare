"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/providers/language-provider";
import { FEEDBACK_TEXT, SECTIONS } from "@/lib/content/home";
import { feedbackSchema } from "@/lib/validations/feedback";
import { cn } from "@/lib/utils";
import { Section } from "./section";

type Item = { id: string; name: string; rating: number; message: string };

function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          aria-label={`${n} / 5`}
          className="disabled:cursor-default"
        >
          <Star className={cn("size-5", n <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
        </button>
      ))}
    </div>
  );
}

export function FeedbackSection() {
  const { l } = useLanguage();
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => (r.ok ? r.json() : []))
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = feedbackSchema.safeParse({ name, rating, message });
    if (!parsed.success) {
      toast.error(l(FEEDBACK_TEXT.invalid));
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error();
      toast.success(l(FEEDBACK_TEXT.thanks));
      setName("");
      setRating(0);
      setMessage("");
    } catch {
      toast.error(l(FEEDBACK_TEXT.failed));
    } finally {
      setSending(false);
    }
  }

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

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fb-name">{l(FEEDBACK_TEXT.name)}</Label>
                <Input id="fb-name" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>{l(FEEDBACK_TEXT.rating)}</Label>
                <Stars value={rating} onChange={setRating} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fb-message">{l(FEEDBACK_TEXT.message)}</Label>
                <textarea
                  id="fb-message"
                  rows={4}
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                />
              </div>
              <Button type="submit" disabled={sending}>
                {sending ? l(FEEDBACK_TEXT.sending) : l(FEEDBACK_TEXT.submit)}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}