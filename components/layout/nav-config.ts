import type { TranslationKey } from "@/lib/i18n/dictionary";

export type NavItem = {
  href: string;
  labelKey: TranslationKey;
  requiresAuth?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", labelKey: "nav.dashboard", requiresAuth: true },
  { href: "/#categories", labelKey: "nav.categories" },
  { href: "/#schedule", labelKey: "nav.schedule" },
  { href: "/#why", labelKey: "nav.why" },
  { href: "/#how", labelKey: "nav.how" },
  { href: "/#feedback", labelKey: "nav.feedback" },
  { href: "/ai-assistant", labelKey: "nav.assistant" },
  { href: "/#about", labelKey: "nav.about" },
];