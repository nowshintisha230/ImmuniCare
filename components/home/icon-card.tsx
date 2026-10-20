"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import type { Localized } from "@/lib/content/types";

type Props = { icon: LucideIcon; title: Localized; text: Localized; step?: number };

export function IconCard({ icon: Icon, title, text, step }: Props) {
  const { l } = useLanguage();
  return (
    <Card className="h-full">
      <CardContent className="flex flex-col gap-3 pt-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
          {step && <span className="text-sm font-semibold text-muted-foreground">0{step}</span>}
        </div>
        <h3 className="font-semibold">{l(title)}</h3>
        <p className="text-sm text-muted-foreground">{l(text)}</p>
      </CardContent>
    </Card>
  );
}