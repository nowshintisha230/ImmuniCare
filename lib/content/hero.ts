import type { Localized } from "./types";

const L = (en: string, bn: string): Localized => ({ en, bn });

export const HERO_TEXT = {
  badge: L("Made for Bangladesh · EPI based", "বাংলাদেশের জন্য · ইপিআই ভিত্তিক"),
  titleStart: L("Protect your child from", "আপনার সন্তানকে রক্ষা করুন"),
  titleEnd: L("Never miss a vaccine.", "কোনো টিকা আর মিস নয়।"),
  subtitle: L(
    "Track the government EPI schedule and extra private vaccines in one place. Get reminders in Bangla or English.",
    "সরকারি ইপিআই সময়সূচি ও অতিরিক্ত প্রাইভেট টিকা এক জায়গায় ট্র্যাক করুন। বাংলা বা ইংরেজিতে রিমাইন্ডার পান।",
  ),
  primary: L("Get started free", "বিনামূল্যে শুরু করুন"),
  secondary: L("See vaccine schedule", "টিকার সময়সূচি দেখুন"),
  diseases: [
    L("Tuberculosis", "যক্ষ্মা"),
    L("Polio", "পোলিও"),
    L("Pneumonia", "নিউমোনিয়া"),
    L("Measles", "হাম"),
    L("Typhoid", "টাইফয়েড"),
    L("Rotavirus", "রোটাভাইরাস"),
    L("Chickenpox", "জলবসন্ত"),
  ],
  stats: {
    government: L("Government EPI vaccines", "সরকারি ইপিআই টিকা"),
    private: L("Additional private vaccines", "অতিরিক্ত প্রাইভেট টিকা"),
    total: L("Vaccines tracked", "টিকা ট্র্যাক হয়"),
  },
  card: {
    sample: L("Sample preview", "নমুনা প্রিভিউ"),
    child: L("Baby Amina · 14 weeks", "শিশু আমিনা · ১৪ সপ্তাহ"),
    progress: L("Vaccination progress", "টিকাদান অগ্রগতি"),
    done: L("Completed", "সম্পন্ন"),
    dueToday: L("Due today", "আজ দেওয়ার দিন"),
    soon: L("Upcoming at 9 months", "৯ মাসে আসন্ন"),
  },
};