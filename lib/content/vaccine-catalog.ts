import {
  Bug,
  CircleDot,
  Droplets,
  FlaskConical,
  Ribbon,
  Shield,
  ShieldPlus,
  Snowflake,
  Syringe,
  Thermometer,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { Localized } from "./types";
import type { VaccineKey } from "./vaccine-info";

export type VaccineType = "government" | "private";

export type CatalogVaccine = {
  number: number;
  key: VaccineKey;
  type: VaccineType;
  icon: LucideIcon;
  when: Localized;
  doses: Localized;
  note?: Localized;
};

const L = (en: string, bn: string): Localized => ({ en, bn });

const entries: Omit<CatalogVaccine, "number">[] = [
  // Government EPI (7)
  { key: "BCG", type: "government", icon: Syringe, when: L("At birth", "জন্মের সময়"), doses: L("1 dose", "১ ডোজ") },
  { key: "PENTA", type: "government", icon: ShieldPlus, when: L("6, 10 and 14 weeks", "৬, ১০ ও ১৪ সপ্তাহ"), doses: L("3 doses", "৩ ডোজ") },
  { key: "OPV", type: "government", icon: Droplets, when: L("6, 10 and 14 weeks", "৬, ১০ ও ১৪ সপ্তাহ"), doses: L("3 doses", "৩ ডোজ") },
  { key: "IPV", type: "government", icon: Syringe, when: L("6 and 14 weeks", "৬ ও ১৪ সপ্তাহ"), doses: L("2 doses", "২ ডোজ") },
  { key: "PCV", type: "government", icon: Wind, when: L("6, 10 and 14 weeks", "৬, ১০ ও ১৪ সপ্তাহ"), doses: L("3 doses", "৩ ডোজ") },
  { key: "MR", type: "government", icon: Thermometer, when: L("9 and 15 months", "৯ ও ১৫ মাস"), doses: L("2 doses", "২ ডোজ") },
  { key: "TCV", type: "government", icon: Bug, when: L("9 months", "৯ মাস"), doses: L("1 dose", "১ ডোজ") },

  // Private / additional (6)
  {
    key: "ROTA",
    type: "private",
    icon: Waves,
    when: L("From 6 weeks (first dose before 15 weeks)", "৬ সপ্তাহ থেকে (প্রথম ডোজ ১৫ সপ্তাহের আগে)"),
    doses: L("2 doses (some brands 3)", "২ ডোজ (কিছু ব্র্যান্ডে ৩)"),
  },
  {
    key: "HEPA",
    type: "private",
    icon: FlaskConical,
    when: L("From 12 months", "১২ মাস থেকে"),
    doses: L("2 doses, 6 months apart", "২ ডোজ, ৬ মাস ব্যবধানে"),
  },
  {
    key: "VAR",
    type: "private",
    icon: CircleDot,
    when: L("12-15 months, then 4-6 years", "১২–১৫ মাস, তারপর ৪–৬ বছর"),
    doses: L("2 doses", "২ ডোজ"),
    note: L("Second dose timing varies. Your doctor will advise.", "২য় ডোজের সময় ভিন্ন হতে পারে। ডাক্তার পরামর্শ দেবেন।"),
  },
  {
    key: "FLU",
    type: "private",
    icon: Snowflake,
    when: L("From 6 months, every year", "৬ মাস থেকে, প্রতি বছর"),
    doses: L("2 doses first time (4 weeks apart), then 1 yearly", "প্রথমবার ২ ডোজ (৪ সপ্তাহ ব্যবধানে), তারপর বছরে ১ ডোজ"),
  },
  {
    key: "MMR",
    type: "private",
    icon: Shield,
    when: L("12-15 months, then 4-6 years", "১২–১৫ মাস, তারপর ৪–৬ বছর"),
    doses: L("2 doses", "২ ডোজ"),
    note: L(
      "EPI already gives MR at 9 and 15 months. Ask your doctor how MMR fits in.",
      "ইপিআই-তে ৯ ও ১৫ মাসে MR দেওয়া হয়। MMR কীভাবে মেলাবেন ডাক্তারকে জিজ্ঞেস করুন।",
    ),
  },
  {
    key: "HPV",
    type: "private",
    icon: Ribbon,
    when: L("9-14 years", "৯–১৪ বছর"),
    doses: L("2 doses, 6 months apart (3 doses from age 15)", "২ ডোজ, ৬ মাস ব্যবধানে (১৫ বছর থেকে ৩ ডোজ)"),
    note: L(
      "Government gives HPV free to girls in grades 5-9 (or age 10-14, out of school).",
      "সরকার ৫ম–৯ম শ্রেণির (বা স্কুলের বাইরে ১০–১৪ বছর) মেয়েদের বিনামূল্যে HPV দেয়।",
    ),
  },
];

export const CATALOG: CatalogVaccine[] = entries.map((e, i) => ({ ...e, number: i + 1 }));

export const COUNTS = {
  government: CATALOG.filter((v) => v.type === "government").length,
  private: CATALOG.filter((v) => v.type === "private").length,
  total: CATALOG.length,
};