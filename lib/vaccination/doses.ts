import type { VaccineKey } from "@/lib/content/vaccine-info";

type Offset = { days: number } | { months: number };
export type DoseType = "government" | "private";

export type DoseDef = {
  code: string;
  vaccine: VaccineKey;
  doseNumber: number;
  offset: Offset;
  type: DoseType;
  /** last age (in days) at which the dose can still be given. Used for rotavirus. */
  lastDays?: number;
};

const make =
  (type: DoseType) =>
  (vaccine: VaccineKey, doseNumber: number, offset: Offset, lastDays?: number): DoseDef => ({
    code: `${vaccine}-${doseNumber}`,
    vaccine,
    doseNumber,
    offset,
    type,
    lastDays,
  });

const gov = make("government");
const priv = make("private");

const weeks = (n: number): Offset => ({ days: n * 7 });
const months = (n: number): Offset => ({ months: n });
const years = (n: number): Offset => ({ months: n * 12 });

export const DOSE_DEFS: DoseDef[] = [
  // Government EPI (7 vaccines, 15 doses)
  gov("BCG", 1, { days: 0 }),
  gov("PENTA", 1, weeks(6)),
  gov("PENTA", 2, weeks(10)),
  gov("PENTA", 3, weeks(14)),
  gov("OPV", 1, weeks(6)),
  gov("OPV", 2, weeks(10)),
  gov("OPV", 3, weeks(14)),
  gov("IPV", 1, weeks(6)),
  gov("IPV", 2, weeks(14)),
  gov("PCV", 1, weeks(6)),
  gov("PCV", 2, weeks(10)),
  gov("PCV", 3, weeks(14)),
  gov("MR", 1, months(9)),
  gov("MR", 2, months(15)),
  gov("TCV", 1, months(9)),

  // Private / additional (6 vaccines, 12 doses). Ages follow general WHO/IAP/CDC guidance.
  priv("ROTA", 1, weeks(6), 104),
  priv("ROTA", 2, weeks(10), 243),
  priv("HEPA", 1, months(12)),
  priv("HEPA", 2, months(18)),
  priv("VAR", 1, months(12)),
  priv("VAR", 2, years(4)),
  priv("FLU", 1, months(6)),
  priv("FLU", 2, months(7)),
  priv("MMR", 1, months(12)),
  priv("MMR", 2, years(4)),
  priv("HPV", 1, years(9)),
  priv("HPV", 2, months(114)),
];

export const DOSE_CODES = new Set(DOSE_DEFS.map((d) => d.code));
export const VACCINE_ORDER: VaccineKey[] = [...new Set(DOSE_DEFS.map((d) => d.vaccine))];
export const VACCINE_COUNT = VACCINE_ORDER.length;

export const VACCINE_TYPE = Object.fromEntries(
  DOSE_DEFS.map((d) => [d.vaccine, d.type]),
) as Record<VaccineKey, DoseType>;

const countVaccines = (type: DoseType) =>
  new Set(DOSE_DEFS.filter((d) => d.type === type).map((d) => d.vaccine)).size;
const countDoses = (type: DoseType) => DOSE_DEFS.filter((d) => d.type === type).length;

export const TOTALS = {
  vaccines: { government: countVaccines("government"), private: countVaccines("private"), all: VACCINE_COUNT },
  doses: { government: countDoses("government"), private: countDoses("private"), all: DOSE_DEFS.length },
};

export function dueDateFor(dob: Date, offset: Offset): Date {
  const due = new Date(dob.getTime());
  if ("days" in offset) due.setUTCDate(due.getUTCDate() + offset.days);
  else due.setUTCMonth(due.getUTCMonth() + offset.months);
  return due;
}