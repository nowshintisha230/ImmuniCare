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

function BdFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 18" className={cn("h-4 w-6 rounded-[2px]", className)} aria-hidden="true">
      <rect width="30" height="18" fill="#006a4e" />
      <circle cx="13" cy="9" r="5" fill="#f42a41" />
    </svg>
  );
}

function useCountUp(target: number, duration = 1200) {
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
    <span key={index} className="bd-rise inline-block text-amber-300">
      {l(items[index])}
    </span>
  );
}

function Stat({ value, label }: { value: number; label: Localized }) {
  const { l } = useLanguage();
  const shown = useCountUp(value);
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
      <p className="text-3xl font-bold tabular-nums">{shown}</p>
      <p className="text-xs text-emerald-50/80">{l(label)}</p>
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
    { icon: AlertCircle, name: "Pentavalent", text: c.dueToday, color: "text-[#f42a41]" },
    { icon: CalendarClock, name: "MR · TCV", text: c.soon, color: "text-sky-600" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="bd-float absolute -left-3 -top-5 z-10 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-emerald-950 shadow-lg sm:-left-8">
        BCG
      </div>
      <div className="bd-float-slow absolute -right-2 top-1/3 z-10 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#f42a41] shadow-lg sm:-right-8">
        MR
      </div>
      <div className="bd-float absolute -bottom-4 left-6 z-10 rounded-full bg-[#f42a41] px-3 py-1 text-xs font-bold text-white shadow-lg">
        TCV
      </div>

      <div className="rounded-3xl bg-white p-5 text-slate-900 shadow-2xl ring-1 ring-black/5">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-[#006a4e] text-white">
            <ShieldCheck className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{l(c.child)}</p>
            <p className="text-xs text-slate-500">{l(c.sample)}</p>
          </div>
        </div>

        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>{l(c.progress)}</span>
          <span className="font-semibold text-[#006a4e]">62%</span>
        </div>
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#006a4e] to-emerald-400 transition-all duration-1000 ease-out"
            style={{ width: ready ? "62%" : "0%" }}
          />
        </div>

        <ul className="flex flex-col gap-2">
          {rows.map(({ icon: Icon, name, text, color }) => (
            <li key={name} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Icon className={cn("size-4", color)} />
                {name}
              </span>
              <span className={cn("text-xs font-medium", color)}>{l(text)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Hero() {
  const { l } = useLanguage();

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#003d2b] via-[#006a4e] to-[#0b8f66] text-white">
      <div className="bd-pattern absolute inset-0 -z-10 opacity-70" aria-hidden="true" />
      <div
        className="bd-pulse absolute -right-20 -top-20 -z-10 size-64 rounded-full bg-[#f42a41] opacity-90 shadow-[0_0_120px_40px_rgba(244,42,65,0.35)] sm:size-96 lg:right-[6%] lg:top-8"
        aria-hidden="true"
      />
      <div className="absolute -bottom-32 -left-24 -z-10 size-80 rounded-full bg-emerald-300/20 blur-3xl" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-28 pt-14 sm:pt-20 lg:grid-cols-2 lg:gap-10 lg:pt-24">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur sm:text-sm">
            <BdFlag />
            {l(HERO_TEXT.badge)}
          </span>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {l(HERO_TEXT.titleStart)}
            <br />
            <RotatingText items={HERO_TEXT.diseases} />
          </h1>
          <p className="text-xl font-semibold text-emerald-100 sm:text-2xl">{l(HERO_TEXT.titleEnd)}</p>

          <p className="max-w-xl text-base text-emerald-50/90 sm:text-lg">{l(HERO_TEXT.subtitle)}</p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-[#f42a41] text-white shadow-lg shadow-red-900/30 hover:bg-[#d91f35]",
              )}
            >
              {l(HERO_TEXT.primary)}
            </Link>
            <Link
              href="/#schedule"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white",
              )}
            >
              {l(HERO_TEXT.secondary)}
            </Link>
          </div>

          <div className="mt-2 grid w-full max-w-lg grid-cols-3 gap-3">
            <Stat value={COUNTS.government} label={HERO_TEXT.stats.government} />
            <Stat value={COUNTS.private} label={HERO_TEXT.stats.private} />
            <Stat value={COUNTS.total} label={HERO_TEXT.stats.total} />
          </div>
        </div>

        <PreviewCard />
      </div>

      <svg
        className="absolute bottom-0 left-0 w-full fill-background"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 40C240 80 480 0 720 30s480 50 720 10V80H0Z" />
      </svg>
    </section>
  );
}