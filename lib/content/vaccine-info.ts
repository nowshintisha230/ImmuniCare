import type { Localized } from "./types";

export type ScheduleVaccine = { name: string; protects: Localized };

export const VACCINES = {
  BCG: { name: "BCG", protects: { en: "Tuberculosis", bn: "যক্ষ্মা" } },
  PENTA: {
    name: "Pentavalent",
    protects: {
      en: "Diphtheria, tetanus, whooping cough, hepatitis B, Hib",
      bn: "ডিপথেরিয়া, ধনুষ্টংকার, হুপিং কাশি, হেপাটাইটিস বি, হিব",
    },
  },
  OPV: { name: "OPV", protects: { en: "Polio (oral)", bn: "পোলিও (মুখে খাওয়ার)" } },
  IPV: { name: "IPV", protects: { en: "Polio (injection)", bn: "পোলিও (ইনজেকশন)" } },
  PCV: { name: "PCV", protects: { en: "Pneumonia", bn: "নিউমোনিয়া" } },
  MR: { name: "MR", protects: { en: "Measles and rubella", bn: "হাম ও রুবেলা" } },
  TCV: { name: "TCV", protects: { en: "Typhoid", bn: "টাইফয়েড" } },
  HPV: { name: "HPV", protects: { en: "Cervical cancer", bn: "জরায়ুমুখ ক্যান্সার" } },
  TD: { name: "Td", protects: { en: "Tetanus", bn: "ধনুষ্টংকার" } },
} satisfies Record<string, ScheduleVaccine>;

export type VaccineKey = keyof typeof VACCINES;