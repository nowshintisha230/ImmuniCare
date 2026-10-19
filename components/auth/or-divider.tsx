"use client";

import { useLanguage } from "@/components/providers/language-provider";

export function OrDivider() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      {t("auth.or")}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}