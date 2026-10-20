import { Bell, CalendarCheck, Languages, Lock, ShieldCheck, UserPlus, ClipboardList, Baby, type LucideIcon } from "lucide-react";
import type { Localized } from "./types";

export const HERO = {
  badge: { en: "Based on Bangladesh EPI", bn: "বাংলাদেশ ইপিআই অনুযায়ী" } as Localized,
  title: {
    en: "Never miss your child's vaccine again",
    bn: "আপনার সন্তানের কোনো টিকা আর মিস হবে না",
  } as Localized,
  subtitle: {
    en: "ImmuniCare tracks your child's vaccination schedule, reminds you before each dose and keeps every record in one place.",
    bn: "ImmuniCare আপনার সন্তানের টিকার সময়সূচি ট্র্যাক করে, প্রতিটি ডোজের আগে মনে করিয়ে দেয় এবং সব রেকর্ড এক জায়গায় রাখে।",
  } as Localized,
  primaryCta: { en: "Get started", bn: "শুরু করুন" } as Localized,
  secondaryCta: { en: "View schedule", bn: "সময়সূচি দেখুন" } as Localized,
};

export const SECTIONS = {
  categories: {
    title: { en: "Explore vaccine categories", bn: "ভ্যাকসিন ক্যাটাগরি দেখুন" } as Localized,
    subtitle: {
      en: "Vaccines offered under the Bangladesh Expanded Programme on Immunization (EPI).",
      bn: "বাংলাদেশ সম্প্রসারিত টিকাদান কর্মসূচি (ইপিআই) এর আওতায় দেওয়া টিকাসমূহ।",
    } as Localized,
  },
  schedule: {
    title: { en: "Vaccine schedule", bn: "ভ্যাকসিন সময়সূচি" } as Localized,
    subtitle: {
      en: "The routine EPI schedule from birth to 15 months, plus HPV and tetanus.",
      bn: "জন্ম থেকে ১৫ মাস পর্যন্ত নিয়মিত ইপিআই সময়সূচি, সঙ্গে HPV ও ধনুষ্টংকার।",
    } as Localized,
    note: {
      en: "Always confirm dates with your nearest EPI centre or health worker. Schedules can change.",
      bn: "তারিখ সবসময় আপনার নিকটস্থ ইপিআই কেন্দ্র বা স্বাস্থ্যকর্মীর কাছ থেকে নিশ্চিত করুন। সময়সূচি পরিবর্তিত হতে পারে।",
    } as Localized,
  },
  why: {
    title: { en: "Why ImmuniCare", bn: "কেন ImmuniCare" } as Localized,
    subtitle: {
      en: "Simple, trustworthy and built for Bangladeshi families.",
      bn: "সহজ, নির্ভরযোগ্য এবং বাংলাদেশি পরিবারের জন্য তৈরি।",
    } as Localized,
  },
  how: {
    title: { en: "How it works", bn: "কীভাবে কাজ করে" } as Localized,
    subtitle: { en: "Four simple steps.", bn: "চারটি সহজ ধাপ।" } as Localized,
  },
  feedback: {
    title: { en: "Parent feedback", bn: "অভিভাবকদের মতামত" } as Localized,
    subtitle: {
      en: "Tell us how ImmuniCare is working for your family.",
      bn: "ImmuniCare আপনার পরিবারের জন্য কেমন কাজ করছে জানান।",
    } as Localized,
  },
  about: {
    title: { en: "About ImmuniCare", bn: "ImmuniCare সম্পর্কে" } as Localized,
  },
};

type Feature = { icon: LucideIcon; title: Localized; text: Localized };

export const WHY_FEATURES: Feature[] = [
  {
    icon: ShieldCheck,
    title: { en: "Follows Bangladesh EPI", bn: "বাংলাদেশ ইপিআই অনুসরণ" },
    text: {
      en: "Schedules are based on the national EPI programme.",
      bn: "সময়সূচি জাতীয় ইপিআই কর্মসূচির উপর ভিত্তি করে তৈরি।",
    },
  },
  {
    icon: Bell,
    title: { en: "Timely reminders", bn: "সময়মতো রিমাইন্ডার" },
    text: {
      en: "Get notified before each dose is due.",
      bn: "প্রতিটি ডোজের সময় হওয়ার আগে নোটিফিকেশন পান।",
    },
  },
  {
    icon: Languages,
    title: { en: "Bangla and English", bn: "বাংলা ও ইংরেজি" },
    text: {
      en: "Switch language anytime with one tap.",
      bn: "এক ট্যাপে যেকোনো সময় ভাষা বদলান।",
    },
  },
  {
    icon: Lock,
    title: { en: "Private and secure", bn: "গোপনীয় ও নিরাপদ" },
    text: {
      en: "Your family's data is protected by secure sign-in.",
      bn: "নিরাপদ সাইন-ইনের মাধ্যমে আপনার পরিবারের তথ্য সুরক্ষিত।",
    },
  },
];

export const HOW_STEPS: Feature[] = [
  {
    icon: UserPlus,
    title: { en: "Create an account", bn: "অ্যাকাউন্ট খুলুন" },
    text: { en: "Register with email or Google.", bn: "ইমেইল বা Google দিয়ে রেজিস্টার করুন।" },
  },
  {
    icon: Baby,
    title: { en: "Add your child", bn: "সন্তানের তথ্য দিন" },
    text: { en: "Enter name, date of birth and sex.", bn: "নাম, জন্ম তারিখ ও লিঙ্গ দিন।" },
  },
  {
    icon: CalendarCheck,
    title: { en: "See the schedule", bn: "সময়সূচি দেখুন" },
    text: {
      en: "Get due dates calculated from the birth date.",
      bn: "জন্ম তারিখ থেকে হিসাব করা টিকার তারিখ পান।",
    },
  },
  {
    icon: ClipboardList,
    title: { en: "Track every dose", bn: "প্রতিটি ডোজ ট্র্যাক করুন" },
    text: {
      en: "Mark doses as given and keep records.",
      bn: "ডোজ দেওয়া হলে মার্ক করুন এবং রেকর্ড রাখুন।",
    },
  },
];

export const ABOUT = {
  paragraphs: [
    {
      en: "ImmuniCare helps parents in Bangladesh keep their children's vaccinations on schedule. We turn the national EPI schedule into a simple, personal timeline for every child.",
      bn: "ImmuniCare বাংলাদেশের অভিভাবকদের সন্তানের টিকা সময়মতো দিতে সাহায্য করে। আমরা জাতীয় ইপিআই সময়সূচিকে প্রতিটি শিশুর জন্য সহজ ও ব্যক্তিগত টাইমলাইনে রূপ দিই।",
    },
    {
      en: "ImmuniCare is an information and tracking tool. It does not replace advice from a doctor or vaccinator. Please follow your health worker's guidance.",
      bn: "ImmuniCare একটি তথ্য ও ট্র্যাকিং টুল। এটি ডাক্তার বা টিকাদানকর্মীর পরামর্শের বিকল্প নয়। অনুগ্রহ করে আপনার স্বাস্থ্যকর্মীর নির্দেশনা মানুন।",
    },
  ] as Localized[],
};

export const FEEDBACK_TEXT = {
  name: { en: "Your name", bn: "আপনার নাম" } as Localized,
  rating: { en: "Rating", bn: "রেটিং" } as Localized,
  message: { en: "Your feedback", bn: "আপনার মতামত" } as Localized,
  submit: { en: "Submit feedback", bn: "মতামত পাঠান" } as Localized,
  sending: { en: "Sending...", bn: "পাঠানো হচ্ছে..." } as Localized,
    thanks: {
    en: "Thank you! Your feedback is now live on the home page.",
    bn: "ধন্যবাদ! আপনার মতামত এখন হোম পেজে দেখা যাচ্ছে।",
  } as Localized,
  failed: { en: "Could not send feedback. Try again.", bn: "মতামত পাঠানো যায়নি। আবার চেষ্টা করুন।" } as Localized,
  invalid: {
    en: "Please enter your name, a rating and a message (at least 10 characters).",
    bn: "নাম, রেটিং ও মতামত (কমপক্ষে ১০ অক্ষর) দিন।",
  } as Localized,
  empty: { en: "No feedback yet. Be the first!", bn: "এখনো কোনো মতামত নেই। আপনিই প্রথম হোন!" } as Localized,
};

export const ASSISTANT_TEXT = {
  title: { en: "ImmuniCare Assistant", bn: "ImmuniCare সহকারী" } as Localized,
  subtitle: {
    en: "Ask about vaccines, schedules and what to expect. For medical emergencies, contact a doctor.",
    bn: "টিকা, সময়সূচি ও কী আশা করবেন তা জিজ্ঞেস করুন। জরুরি স্বাস্থ্য সমস্যায় ডাক্তারের সাথে যোগাযোগ করুন।",
  } as Localized,
  placeholder: { en: "Type your question...", bn: "আপনার প্রশ্ন লিখুন..." } as Localized,
  send: { en: "Send", bn: "পাঠান" } as Localized,
  thinking: { en: "Thinking...", bn: "ভাবছি..." } as Localized,
  error: { en: "Assistant is unavailable right now. Try again later.", bn: "সহকারী এখন পাওয়া যাচ্ছে না। পরে আবার চেষ্টা করুন।" } as Localized,
  suggestions: [
    { en: "When is the MR vaccine due?", bn: "এমআর টিকা কখন দিতে হয়?" },
    { en: "What if my baby has fever after vaccination?", bn: "টিকার পর শিশুর জ্বর হলে কী করব?" },
    { en: "What does the pentavalent vaccine protect against?", bn: "পেন্টাভ্যালেন্ট টিকা কোন রোগ থেকে রক্ষা করে?" },
  ] as Localized[],
};