"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CalendarClock, CheckCircle2, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { HERO_TEXT } from "@/lib/content/hero";
import type { Localized } from "@/lib/content/types";
import { COUNTS } from "@/lib/content/vaccine-catalog";
import { cn } from "@/lib/utils";

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function RotatingText({ items }: { items: Localized[] }) {
  const { l } = useLanguage();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 2600);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    <span key={index} className="bd-rise inline-block text-primary">
      {l(items[index])}
    </span>
  );
}

function Stat({ value, label }: { value: number; label: Localized }) {
  const { l } = useLanguage();
  const shown = useCountUp(value);
  return (
    <div className="rounded-xl border bg-card/80 px-3 py-2 backdrop-blur">
      <p className="text-2xl font-bold tabular-nums text-primary">{shown}</p>
      <p className="text-xs text-muted-foreground">{l(label)}</p>
    </div>
  );
}

function PreviewCard() {
  const { l } = useLanguage();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(id);
  }, []);

  const c = HERO_TEXT.card;
  const rows = [
    { icon: CheckCircle2, name: "BCG", text: c.done, color: "text-emerald-600" },
    { icon: AlertCircle, name: "Pentavalent", text: c.dueToday, color: "text-destructive" },
    { icon: CalendarClock, name: "MR · TCV", text: c.soon, color: "text-sky-600" },
  ];

  return (
    <div className="mx-auto hidden w-full max-w-xs rounded-2xl border bg-card p-4 shadow-lg lg:block">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ShieldCheck className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{l(c.child)}</p>
          <p className="text-xs text-muted-foreground">{l(c.sample)}</p>
        </div>
      </div>

      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span>{l(c.progress)}</span>
        <span className="font-semibold text-primary">62%</span>
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: ready ? "62%" : "0%" }}
        />
      </div>

      <ul className="flex flex-col gap-1.5">
        {rows.map(({ icon: Icon, name, text, color }) => (
          <li key={name} className="flex items-center justify-between gap-2 rounded-lg bg-muted/60 px-2.5 py-2">
            <span className="flex items-center gap-2 text-xs font-medium">
              <Icon className={cn("size-3.5", color)} />
              {name}
            </span>
            <span className={cn("text-xs", color)}>{l(text)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Hero() {
  const { l } = useLanguage();

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-accent/60 to-background">
      <div className="hero-pattern absolute inset-0 -z-10" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col items-start gap-4">
          <span className="rounded-full border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            {l(HERO_TEXT.badge)}
          </span>

          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {l(HERO_TEXT.titleStart)} <RotatingText items={HERO_TEXT.diseases} />
          </h1>

          <p className="max-w-xl text-base text-muted-foreground">{l(HERO_TEXT.subtitle)}</p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/register" className={buttonVariants({ size: "lg" })}>
              {l(HERO_TEXT.primary)}
            </Link>
            <Link href="/#schedule" className={buttonVariants({ size: "lg", variant: "outline" })}>
              {l(HERO_TEXT.secondary)}
            </Link>
          </div>

          <div className="grid w-full max-w-md grid-cols-3 gap-2">
            <Stat value={COUNTS.government} label={HERO_TEXT.stats.government} />
            <Stat value={COUNTS.private} label={HERO_TEXT.stats.private} />
            <Stat value={COUNTS.total} label={HERO_TEXT.stats.total} />
          </div>
        </div>

        <PreviewCard />
      </div>
    </section>
  );
}