import type { Localized } from "./types";

const L = (en: string, bn: string): Localized => ({ en, bn });

export const CATALOG_TEXT = {
  categories: {
    title: L("Explore vaccine categories", "ভ্যাকসিন ক্যাটাগরি দেখুন"),
    subtitle: L(
      "7 vaccines from the government EPI programme and 6 additional private vaccines.",
      "সরকারি ইপিআই কর্মসূচির ৭টি টিকা এবং ৬টি অতিরিক্ত প্রাইভেট টিকা।",
    ),
  },
  schedule: {
    title: L("Vaccine schedule at a glance", "এক নজরে টিকার সময়সূচি"),
    subtitle: L(
      "Vaccine name, time and number of doses.",
      "টিকার নাম, সময় ও ডোজ সংখ্যা।",
    ),
  },
  types: {
    government: L("Government EPI", "সরকারি ইপিআই"),
    private: L("Private / additional", "প্রাইভেট / অতিরিক্ত"),
  },
  badge: {
    government: L("Government", "সরকারি"),
    private: L("Private", "প্রাইভেট"),
  },
  labels: {
    vaccine: L("Vaccine", "টিকা"),
    when: L("When", "কখন"),
    doses: L("Doses", "ডোজ"),
    viewDetails: L("View details", "বিস্তারিত দেখুন"),
  },
  notes: {
    government: L(
      "Provided free under the national EPI programme. Confirm dates with your nearest EPI centre or health worker.",
      "জাতীয় ইপিআই কর্মসূচির আওতায় বিনামূল্যে দেওয়া হয়। তারিখ নিকটস্থ ইপিআই কেন্দ্র বা স্বাস্থ্যকর্মীর কাছ থেকে নিশ্চিত করুন।",
    ),
    private: L(
      "These are not part of the free EPI schedule. Availability, brand, dose count and cost vary. Ages shown follow general WHO/IAP/CDC guidance, so please ask your paediatrician before vaccinating.",
      "এগুলো বিনামূল্যে ইপিআই সময়সূচির অংশ নয়। প্রাপ্যতা, ব্র্যান্ড, ডোজ সংখ্যা ও খরচ ভিন্ন হয়। এখানকার বয়স WHO/IAP/CDC এর সাধারণ নির্দেশনা অনুযায়ী, তাই টিকা দেওয়ার আগে শিশুরোগ বিশেষজ্ঞের পরামর্শ নিন।",
    ),
  },
};