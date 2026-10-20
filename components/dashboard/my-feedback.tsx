"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { Stars } from "@/components/feedback/stars";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH } from "@/lib/content/dashboard";
import type { MyFeedbackView } from "@/lib/dashboard/types";
import { formatDateKey } from "@/lib/format";

type Props = { items: MyFeedbackView[]; onChange: () => void | Promise<void> };

export function MyFeedback({ items, onChange }: Props) {
  const { l, language } = useLanguage();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">{l(DASH.feedback.empty)}</p>}
        {items.map((f) => (
          <Card key={f.id}>
            <CardContent className="flex flex-col gap-2 pt-6">
              <Stars value={f.rating} />
              <p className="text-sm">{f.message}</p>
              <p className="text-xs text-muted-foreground">{formatDateKey(f.createdAt.slice(0, 10), language)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <FeedbackForm onSubmitted={onChange} />
    </div>
  );
}