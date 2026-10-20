import type { Language } from "@/lib/i18n/dictionary";
import type { AgeParts } from "@/lib/vaccination/status";

const locale = (language: Language) => (language === "bn" ? "bn-BD" : "en-GB");

export function formatDateKey(key: string, language: Language) {
  return new Date(`${key}T00:00:00Z`).toLocaleDateString(locale(language), {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}


export function formatDateLong(key: string, language: Language) {
  return new Date(`${key}T00:00:00Z`).toLocaleDateString(locale(language), {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const UNITS = {
  en: { y: ["year", "years"], m: ["month", "months"], d: ["day", "days"], today: "Born today" },
  bn: { y: ["বছর", "বছর"], m: ["মাস", "মাস"], d: ["দিন", "দিন"], today: "আজ জন্ম" },
} as const;

function num(n: number, language: Language) {
  return language === "bn" ? n.toLocaleString("bn-BD") : String(n);
}

function unit(pair: readonly [string, string], n: number) {
  return n === 1 ? pair[0] : pair[1];
}


export function formatAge(age: AgeParts, language: Language) {
  const u = UNITS[language];
  const parts: string[] = [];
  if (age.years) parts.push(`${num(age.years, language)} ${unit(u.y, age.years)}`);
  if (age.months) parts.push(`${num(age.months, language)} ${unit(u.m, age.months)}`);
  if (age.days) parts.push(`${num(age.days, language)} ${unit(u.d, age.days)}`);
  return parts.length ? parts.join(", ") : u.today;
}

export function formatTotalDays(totalDays: number, language: Language) {
  return `${num(totalDays, language)} ${unit(UNITS[language].d, totalDays)}`;
}