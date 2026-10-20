import type { Localized } from "./types";
import type { VaccineKey } from "./vaccine-info";

export type ScheduleItem = { key: VaccineKey; detail?: Localized };
export type ScheduleStage = { id: string; age: Localized; items: ScheduleItem[] };

const L = (en: string, bn: string): Localized => ({ en, bn });
const item = (key: VaccineKey, detail?: Localized): ScheduleItem => ({ key, detail });

export const GOVERNMENT_SCHEDULE: ScheduleStage[] = [
  { id: "birth", age: L("At birth", "জন্মের সময়"), items: [item("BCG")] },
  { id: "w6", age: L("6 weeks", "৬ সপ্তাহ"), items: [item("PENTA"), item("OPV"), item("PCV"), item("IPV")] },
  { id: "w10", age: L("10 weeks", "১০ সপ্তাহ"), items: [item("PENTA"), item("OPV"), item("PCV")] },
  { id: "w14", age: L("14 weeks", "১৪ সপ্তাহ"), items: [item("PENTA"), item("OPV"), item("PCV"), item("IPV")] },
  { id: "m9", age: L("9 months", "৯ মাস"), items: [item("MR"), item("TCV")] },
  { id: "m15", age: L("15 months", "১৫ মাস"), items: [item("MR")] },
];

export const PRIVATE_SCHEDULE: ScheduleStage[] = [
  { id: "p-w6", age: L("6 weeks", "৬ সপ্তাহ"), items: [item("ROTA", L("Dose 1", "ডোজ ১"))] },
  {
    id: "p-w10",
    age: L("10 weeks", "১০ সপ্তাহ"),
    items: [item("ROTA", L("Dose 2 (some brands need a 3rd dose)", "ডোজ ২ (কিছু ব্র্যান্ডে ৩য় ডোজ লাগে)"))],
  },
  {
    id: "p-m6",
    age: L("From 6 months", "৬ মাস থেকে"),
    items: [item("FLU", L("First time: 2 doses, 4 weeks apart. Then 1 dose every year", "প্রথমবার ২ ডোজ, ৪ সপ্তাহ ব্যবধানে। তারপর প্রতি বছর ১ ডোজ"))],
  },
  {
    id: "p-m12",
    age: L("12-15 months", "১২–১৫ মাস"),
    items: [
      item("HEPA", L("Dose 1", "ডোজ ১")),
      item("VAR", L("Dose 1", "ডোজ ১")),
      item("MMR", L("Dose 1 (ask your doctor, EPI gives MR)", "ডোজ ১ (ডাক্তারকে জিজ্ঞেস করুন, ইপিআই-তে MR দেওয়া হয়)")),
    ],
  },
  {
    id: "p-hepa2",
    age: L("6 months after Hepatitis A dose 1", "হেপাটাইটিস এ প্রথম ডোজের ৬ মাস পর"),
    items: [item("HEPA", L("Dose 2", "ডোজ ২"))],
  },
  {
    id: "p-y4",
    age: L("4-6 years", "৪–৬ বছর"),
    items: [
      item("MMR", L("Dose 2", "ডোজ ২")),
      item("VAR", L("Dose 2 (may be given earlier as advised)", "ডোজ ২ (পরামর্শ অনুযায়ী আগেও দেওয়া যায়)")),
    ],
  },
  {
    id: "p-y9",
    age: L("9-14 years", "৯–১৪ বছর"),
    items: [item("HPV", L("2 doses, 6 months apart. From age 15: 3 doses", "২ ডোজ, ৬ মাস ব্যবধানে। ১৫ বছর থেকে ৩ ডোজ"))],
  },
];