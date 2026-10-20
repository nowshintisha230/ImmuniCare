import { VACCINES, type VaccineKey } from "@/lib/content/vaccine-info";
import { DOSE_DEFS, dueDateFor } from "./doses";

export type DoseStatus = "completed" | "due" | "upcoming";

export type DoseView = {
  code: string;
  vaccine: VaccineKey;
  name: string;
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
  percent: number;
};

const DAY_MS = 86_400_000;
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

export function buildChildDoses(dob: Date, given: Map<string, Date>, today: Date): DoseView[] {
  return DOSE_DEFS.map((def) => {
    const due = dueDateFor(dob, def.offset);
    const givenAt = given.get(def.code) ?? null;
    const daysUntil = Math.round((due.getTime() - today.getTime()) / DAY_MS);
    const status: DoseStatus = givenAt ? "completed" : daysUntil <= 0 ? "due" : "upcoming";

    return {
      code: def.code,
      vaccine: def.vaccine,
      name: VACCINES[def.vaccine].name,
      doseNumber: def.doseNumber,
      dueDate: toDateKey(due),
      status,
      daysUntil,
      givenAt: givenAt ? toDateKey(givenAt) : null,
    };
  }).sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.code.localeCompare(b.code));
}

export function computeStats(doses: { status: DoseStatus }[]): Stats {
  const total = doses.length;
  const completed = doses.filter((d) => d.status === "completed").length;
  const due = doses.filter((d) => d.status === "due").length;
  const upcoming = doses.filter((d) => d.status === "upcoming").length;
  return { total, completed, due, upcoming, percent: total ? Math.round((completed / total) * 100) : 0 };
}