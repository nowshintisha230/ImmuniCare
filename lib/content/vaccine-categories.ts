import {
  Baby,
  Bug,
  Droplets,
  HeartPulse,
  Ribbon,
  ShieldPlus,
  Syringe,
  Thermometer,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { Localized } from "./types";

export type VaccineCategory = {
  id: string;
  icon: LucideIcon;
  name: Localized;
  vaccines: string;
  when: Localized;
  description: Localized;
};

export const VACCINE_CATEGORIES: VaccineCategory[] = [
  {
    id: "tb",
    icon: Syringe,
    name: { en: "Tuberculosis", bn: "যক্ষ্মা" },
    vaccines: "BCG",
    when: { en: "At birth", bn: "জন্মের সময়" },
    description: {
      en: "One dose that protects babies from severe forms of TB.",
      bn: "এক ডোজেই শিশুকে যক্ষ্মার গুরুতর রূপ থেকে সুরক্ষা দেয়।",
    },
  },
  {
    id: "penta",
    icon: ShieldPlus,
    name: { en: "5-in-1 (Pentavalent)", bn: "৫-in-১ (পেন্টাভ্যালেন্ট)" },
    vaccines: "Pentavalent",
    when: { en: "6, 10 and 14 weeks", bn: "৬, ১০ ও ১৪ সপ্তাহ" },
    description: {
      en: "Protects against diphtheria, tetanus, whooping cough, hepatitis B and Hib.",
      bn: "ডিপথেরিয়া, ধনুষ্টংকার, হুপিং কাশি, হেপাটাইটিস বি ও হিব থেকে সুরক্ষা।",
    },
  },
  {
    id: "polio",
    icon: Droplets,
    name: { en: "Polio", bn: "পোলিও" },
    vaccines: "OPV, IPV",
    when: { en: "OPV: 6, 10, 14 weeks. IPV: 6 and 14 weeks", bn: "OPV: ৬, ১০, ১৪ সপ্তাহ। IPV: ৬ ও ১৪ সপ্তাহ" },
    description: {
      en: "Oral and injectable vaccines that keep children free from paralysis.",
      bn: "মুখে খাওয়ার ও ইনজেকশন টিকা, যা শিশুকে পক্ষাঘাত থেকে রক্ষা করে।",
    },
  },
  {
    id: "pneumonia",
    icon: Wind,
    name: { en: "Pneumonia", bn: "নিউমোনিয়া" },
    vaccines: "PCV",
    when: { en: "6, 10 and 14 weeks", bn: "৬, ১০ ও ১৪ সপ্তাহ" },
    description: {
      en: "Reduces the risk of serious pneumococcal infections.",
      bn: "নিউমোকক্কাল সংক্রমণের ঝুঁকি কমায়।",
    },
  },
  {
    id: "mr",
    icon: Thermometer,
    name: { en: "Measles and Rubella", bn: "হাম ও রুবেলা" },
    vaccines: "MR",
    when: { en: "9 and 15 months", bn: "৯ ও ১৫ মাস" },
    description: {
      en: "Two doses protect against measles and rubella.",
      bn: "দুই ডোজে হাম ও রুবেলা থেকে সুরক্ষা।",
    },
  },
  {
    id: "typhoid",
    icon: Bug,
    name: { en: "Typhoid", bn: "টাইফয়েড" },
    vaccines: "TCV",
    when: { en: "9 months", bn: "৯ মাস" },
    description: {
      en: "One dose of the typhoid conjugate vaccine.",
      bn: "টাইফয়েড কনজুগেট টিকার এক ডোজ।",
    },
  },
  {
    id: "hpv",
    icon: Ribbon,
    name: { en: "Cervical cancer (HPV)", bn: "জরায়ুমুখ ক্যান্সার (HPV)" },
    vaccines: "HPV",
    when: { en: "Girls in grades 5-9, or age 10-14", bn: "৫ম–৯ম শ্রেণির মেয়ে, বা ১০–১৪ বছর" },
    description: {
      en: "Helps protect girls from cervical cancer later in life.",
      bn: "ভবিষ্যতে জরায়ুমুখ ক্যান্সারের ঝুঁকি কমাতে সাহায্য করে।",
    },
  },
  {
    id: "tetanus",
    icon: HeartPulse,
    name: { en: "Tetanus (women)", bn: "ধনুষ্টংকার (নারী)" },
    vaccines: "Td",
    when: { en: "Women 15-49, 5 doses", bn: "১৫–৪৯ বছর বয়সী নারী, ৫ ডোজ" },
    description: {
      en: "Protects mothers and their newborns from tetanus.",
      bn: "মা ও নবজাতককে ধনুষ্টংকার থেকে সুরক্ষা দেয়।",
    },
  },
];

export const BABY_ICON = Baby;