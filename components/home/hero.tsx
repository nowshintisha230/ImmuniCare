"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { HERO } from "@/lib/content/home";

export function Hero() {
  const { l } = useLanguage();
  return (
    <section className="bg-gradient-to-b from-accent/60 to-background py-20 md:py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center">
        <Badge variant="secondary">{l(HERO.badge)}</Badge>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{l(HERO.title)}</h1>
        <p className="text-lg text-muted-foreground">{l(HERO.subtitle)}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/register" className={buttonVariants({ size: "lg" })}>
            {l(HERO.primaryCta)}
          </Link>
          <Link href="/#schedule" className={buttonVariants({ size: "lg", variant: "outline" })}>
            {l(HERO.secondaryCta)}
          </Link>
        </div>
      </div>
    </section>
  );
}