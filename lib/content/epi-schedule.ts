import type { Localized } from "./types";
import { VACCINES, type ScheduleVaccine } from "./vaccine-info";

export type { ScheduleVaccine };
export type ScheduleStage = { id: string; age: Localized; vaccines: ScheduleVaccine[] };

const { BCG, PENTA, OPV, IPV, PCV, MR, TCV, HPV, TD } = VACCINES;

export const EPI_SCHEDULE: ScheduleStage[] = [
  { id: "birth", age: { en: "At birth", bn: "জন্মের সময়" }, vaccines: [BCG] },
  { id: "w6", age: { en: "6 weeks", bn: "৬ সপ্তাহ" }, vaccines: [PENTA, OPV, PCV, IPV] },
  { id: "w10", age: { en: "10 weeks", bn: "১০ সপ্তাহ" }, vaccines: [PENTA, OPV, PCV] },
  { id: "w14", age: { en: "14 weeks", bn: "১৪ সপ্তাহ" }, vaccines: [PENTA, OPV, PCV, IPV] },
  { id: "m9", age: { en: "9 months", bn: "৯ মাস" }, vaccines: [MR, TCV] },
  { id: "m15", age: { en: "15 months", bn: "১৫ মাস" }, vaccines: [MR] },
  {
    id: "girls",
    age: { en: "Girls: grades 5-9 (or age 10-14 out of school)", bn: "মেয়েরা: ৫ম–৯ম শ্রেণি (স্কুলের বাইরে হলে ১০–১৪ বছর)" },
    vaccines: [HPV],
  },
  {
    id: "women",
    age: { en: "Women aged 15-49 (5 doses)", bn: "১৫–৪৯ বছর বয়সী নারী (৫ ডোজ)" },
    vaccines: [TD],
  },
];