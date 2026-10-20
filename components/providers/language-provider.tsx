"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Localized } from "@/lib/content/types";
import { dictionary, type Language, type TranslationKey } from "@/lib/i18n/dictionary";

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  l: (value: Localized) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "immunicare-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "bn") setLanguage(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {}
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "bn" : "en"));
  }, []);

  const t = useCallback((key: TranslationKey) => dictionary[language][key], [language]);
  const l = useCallback((value: Localized) => value[language], [language]);

  const value = useMemo(
    () => ({ language, toggleLanguage, t, l }),
    [language, toggleLanguage, t, l],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}