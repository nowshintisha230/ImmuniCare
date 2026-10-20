import type { Localized } from "./types";

const L = (en: string, bn: string): Localized => ({ en, bn });

export const USER_TEXT = {
  notifications: L("Notifications", "নোটিফিকেশন"),
  viewAll: L("View all", "সব দেখুন"),
  profile: L("My profile", "আমার প্রোফাইল"),
  dashboard: L("Dashboard", "ড্যাশবোর্ড"),
  account: L("Account menu", "অ্যাকাউন্ট মেনু"),
  logout: L("Logout", "লগআউট"),
  logoutFailed: L("Logout failed. Try again.", "লগআউট করা যায়নি। আবার চেষ্টা করুন।"),
};