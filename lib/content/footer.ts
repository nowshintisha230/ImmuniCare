import type { Localized } from "./types";

const L = (en: string, bn: string): Localized => ({ en, bn });

export const FOOTER_TEXT = {
  tagline: L(
    "Track your child's vaccines, get timely reminders and learn about every vaccine in Bangla and English.",
    "আপনার সন্তানের টিকা ট্র্যাক করুন, সময়মতো রিমাইন্ডার পান এবং বাংলা ও ইংরেজিতে প্রতিটি টিকা সম্পর্কে জানুন।",
  ),
  emergency: L(
    "In an emergency, go to the nearest hospital.",
    "জরুরি অবস্থায় নিকটস্থ হাসপাতালে যান।",
  ),
  explore: L("Explore", "এক্সপ্লোর"),
  vaccines: L("Government EPI vaccines", "সরকারি ইপিআই টিকা"),
  account: L("Account", "অ্যাকাউন্ট"),
  profile: L("My profile", "আমার প্রোফাইল"),
  disclaimer: L(
    "ImmuniCare gives general information, not medical advice. Always follow your vaccinator's or doctor's guidance.",
    "ImmuniCare সাধারণ তথ্য দেয়, চিকিৎসা পরামর্শ নয়। সবসময় আপনার টিকাদানকর্মী বা ডাক্তারের নির্দেশনা মানুন।",
  ),
  rights: L("ImmuniCare. All rights reserved.", "ImmuniCare। সর্বস্বত্ব সংরক্ষিত।"),
};