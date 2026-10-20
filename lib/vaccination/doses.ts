import type { VaccineKey } from "@/lib/content/vaccine-info";

type Offset = { days: number } | { months: number };

export type DoseDef = {
  code: string;
  vaccine: VaccineKey;
  doseNumber: number;
  offset: Offset;
};

const dose = (vaccine: VaccineKey, doseNumber: number, offset: Offset): DoseDef => ({
  code: `${vaccine}-${doseNumber}`,
  vaccine,
  doseNumber,
  offset,
});

const weeks = (n: number): Offset => ({ days: n * 7 });
const months = (n: number): Offset => ({ months: n });

export const DOSE_DEFS: DoseDef[] = [
  dose("BCG", 1, { days: 0 }),
  dose("PENTA", 1, weeks(6)),
  dose("PENTA", 2, weeks(10)),
  dose("PENTA", 3, weeks(14)),
  dose("OPV", 1, weeks(6)),
  dose("OPV", 2, weeks(10)),
  dose("OPV", 3, weeks(14)),
  dose("PCV", 1, weeks(6)),
  dose("PCV", 2, weeks(10)),
  dose("PCV", 3, weeks(14)),
  dose("IPV", 1, weeks(6)),
  dose("IPV", 2, weeks(14)),
  dose("MR", 1, months(9)),
  dose("MR", 2, months(15)),
  dose("TCV", 1, months(9)),
];

export const DOSE_CODES = new Set(DOSE_DEFS.map((d) => d.code));
export const VACCINE_COUNT = new Set(DOSE_DEFS.map((d) => d.vaccine)).size;

export function dueDateFor(dob: Date, offset: Offset): Date {
  const due = new Date(dob.getTime());
  if ("days" in offset) due.setUTCDate(due.getUTCDate() + offset.days);
  else due.setUTCMonth(due.getUTCMonth() + offset.months);
  return due;
}