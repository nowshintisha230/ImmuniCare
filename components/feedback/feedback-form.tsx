"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/providers/language-provider";
import { FEEDBACK_TEXT } from "@/lib/content/home";
import { feedbackSchema } from "@/lib/validations/feedback";
import { Stars } from "./stars";

export function FeedbackForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const { l } = useLanguage();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

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
      onSubmitted?.();
    } catch {
      toast.error(l(FEEDBACK_TEXT.failed));
    } finally {
      setSending(false);
    }
  }

  return (
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
  );
}