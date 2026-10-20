import type { VaccineKey } from "@/lib/content/vaccine-info";
import { DOSE_DEFS } from "./doses";

export type RecordInput = { doseCode: string; givenAt: string };
export type RecordsProblem = "incomplete" | "date" | "duplicate";

export function dosesOfVaccine(vaccine: VaccineKey) {
  return DOSE_DEFS.filter((d) => d.vaccine === vaccine);
}

function isRealDate(key: string) {
  const d = new Date(`${key}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === key;
}


export function checkRecords(dob: string, records: RecordInput[], todayKey: string): RecordsProblem | null {
  const seen = new Set<string>();
  for (const r of records) {
    if (!r.doseCode || !r.givenAt) return "incomplete";
    if (!isRealDate(r.givenAt) || r.givenAt < dob || r.givenAt > todayKey) return "date";
    if (seen.has(r.doseCode)) return "duplicate";
    seen.add(r.doseCode);
  }
  return null;
}