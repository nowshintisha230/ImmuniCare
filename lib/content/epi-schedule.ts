import type { Localized } from "./types";

export type ScheduleVaccine = { name: string; protects: Localized };
export type ScheduleStage = { id: string; age: Localized; vaccines: ScheduleVaccine[] };

const BCG: ScheduleVaccine = { name: "BCG", protects: { en: "Tuberculosis", bn: "যক্ষ্মা" } };
const PENTA: ScheduleVaccine = {
  name: "Pentavalent",
  protects: {
    en: "Diphtheria, tetanus, whooping cough, hepatitis B, Hib",
    bn: "ডিপথেরিয়া, ধনুষ্টংকার, হুপিং কাশি, হেপাটাইটিস বি, হিব",
  },
};
const OPV: ScheduleVaccine = { name: "OPV", protects: { en: "Polio (oral)", bn: "পোলিও (মুখে খাওয়ার)" } };
const IPV: ScheduleVaccine = { name: "IPV", protects: { en: "Polio (injection)", bn: "পোলিও (ইনজেকশন)" } };
const PCV: ScheduleVaccine = { name: "PCV", protects: { en: "Pneumonia", bn: "নিউমোনিয়া" } };
const MR: ScheduleVaccine = { name: "MR", protects: { en: "Measles and rubella", bn: "হাম ও রুবেলা" } };
const TCV: ScheduleVaccine = { name: "TCV", protects: { en: "Typhoid", bn: "টাইফয়েড" } };
const HPV: ScheduleVaccine = { name: "HPV", protects: { en: "Cervical cancer", bn: "জরায়ুমুখ ক্যান্সার" } };
const TD: ScheduleVaccine = { name: "Td", protects: { en: "Tetanus", bn: "ধনুষ্টংকার" } };

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