"use client";

import { useLanguage } from "@/components/providers/language-provider";
import type { Localized } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  title: Localized;
  subtitle?: Localized;
  muted?: boolean;
  children: React.ReactNode;
};

export function Section({ id, title, subtitle, muted, children }: Props) {
  const { l } = useLanguage();
  return (
    <section id={id} className={cn("scroll-mt-16 py-16 md:py-20", muted && "bg-muted/40")}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">{l(title)}</h2>
          {subtitle && <p className="mt-3 text-muted-foreground">{l(subtitle)}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}