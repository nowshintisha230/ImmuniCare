import { VACCINES, type VaccineKey } from "@/lib/content/vaccine-info";
import { DOSE_DEFS, dueDateFor, type DoseType } from "./doses";

export type DoseStatus = "completed" | "due" | "upcoming" | "missed";

export type DoseView = {
  code: string;
  vaccine: VaccineKey;
  name: string;
  type: DoseType;
  doseNumber: number;
  dueDate: string; // YYYY-MM-DD
  status: DoseStatus;
  daysUntil: number; // negative = overdue
  givenAt: string | null;
};

export type Stats = {
  total: number;
  completed: number;
  due: number;
  upcoming: number;
  missed: number; // age window passed, not given
  percent: number;
};

export type AgeParts = { years: number; months: number; days: number; totalDays: number };

export const DAY_MS = 86_400_000;
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;

export function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Today's date (00:00 UTC) as seen in Bangladesh (UTC+6). */
export function startOfTodayDhaka(now: number = Date.now()): Date {
  const d = new Date(now + DHAKA_OFFSET_MS);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function ageInMonths(dob: Date, today: Date) {
  let months =
    (today.getUTCFullYear() - dob.getUTCFullYear()) * 12 +
    (today.getUTCMonth() - dob.getUTCMonth());
  if (today.getUTCDate() < dob.getUTCDate()) months -= 1;
  return Math.max(0, months);
}

export function ageParts(dob: Date, today: Date): AgeParts {
  let years = today.getUTCFullYear() - dob.getUTCFullYear();
  let months = today.getUTCMonth() - dob.getUTCMonth();
  let days = today.getUTCDate() - dob.getUTCDate();

  if (days < 0) {
    months -= 1;
    days += new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 0)).getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.max(0, Math.round((today.getTime() - dob.getTime()) / DAY_MS));
  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days), totalDays };
}

export function buildChildDoses(dob: Date, given: Map<string, Date>, today: Date): DoseView[] {
  const ageDays = Math.round((today.getTime() - dob.getTime()) / DAY_MS);

  return DOSE_DEFS.map((def) => {
    const due = dueDateFor(dob, def.offset);
    const givenAt = given.get(def.code) ?? null;
    const daysUntil = Math.round((due.getTime() - today.getTime()) / DAY_MS);
    const windowPassed = !givenAt && def.lastDays !== undefined && ageDays > def.lastDays;

    const status: DoseStatus = givenAt
      ? "completed"
      : windowPassed
        ? "missed"
        : daysUntil <= 0
          ? "due"
          : "upcoming";

    return {
      code: def.code,
      vaccine: def.vaccine,
      name: VACCINES[def.vaccine].name,
      type: def.type,
      doseNumber: def.doseNumber,
      dueDate: toDateKey(due),
      status,
      daysUntil,
      givenAt: givenAt ? toDateKey(givenAt) : null,
    };
  }).sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.code.localeCompare(b.code));
}

export function computeStats(doses: { status: DoseStatus }[]): Stats {
  const count = (s: DoseStatus) => doses.filter((d) => d.status === s).length;
  const total = doses.length;
  const completed = count("completed");
  const missed = count("missed");
  const applicable = total - missed;

  return {
    total,
    completed,
    due: count("due"),
    upcoming: count("upcoming"),
    missed,
    percent: applicable ? Math.round((completed / applicable) * 100) : 0,
  };
}