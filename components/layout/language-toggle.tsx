"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";

export function LanguageToggle() {
  const { t, toggleLanguage } = useLanguage();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      aria-label={t("ui.languageLabel")}
    >
      <Languages className="size-4" />
      {t("ui.language")}
    </Button>
  );
}