const en = {
  brand: "ImmuniCare",
  "nav.dashboard": "Dashboard",
  "nav.categories": "Explore Vaccine Categories",
  "nav.schedule": "Vaccine Schedule",
  "nav.why": "Why ImmuniCare",
  "nav.how": "How It Works",
  "nav.feedback": "Parent Feedback",
  "nav.assistant": "ImmuniCare Assistant",
  "nav.about": "About",
  "auth.login": "Login",
  "auth.register": "Register",
  "auth.logout": "Logout",
  "ui.menu": "Menu",
  "ui.language": "বাংলা",
  "ui.languageLabel": "Switch to Bangla",
} as const;

export type TranslationKey = keyof typeof en;

const bn: Record<TranslationKey, string> = {
  brand: "ImmuniCare",
  "nav.dashboard": "ড্যাশবোর্ড",
  "nav.categories": "ভ্যাকসিন ক্যাটাগরি দেখুন",
  "nav.schedule": "ভ্যাকসিন সময়সূচি",
  "nav.why": "কেন ImmuniCare",
  "nav.how": "কীভাবে কাজ করে",
  "nav.feedback": "অভিভাবকদের মতামত",
  "nav.assistant": "ImmuniCare সহকারী",
  "nav.about": "আমাদের সম্পর্কে",
  "auth.login": "লগইন",
  "auth.register": "রেজিস্টার",
  "auth.logout": "লগআউট",
  "ui.menu": "মেনু",
  "ui.language": "English",
  "ui.languageLabel": "ইংরেজিতে পরিবর্তন করুন",
};

export const dictionary = { en, bn };
export type Language = keyof typeof dictionary;