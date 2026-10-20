import type { Language } from "@/lib/i18n/dictionary";

export function formatDateKey(key: string, language: Language) {
  return new Date(`${key}T00:00:00Z`).toLocaleDateString(language === "bn" ? "bn-BD" : "en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}