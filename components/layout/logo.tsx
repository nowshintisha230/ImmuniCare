"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function Logo() {
  const { t } = useLanguage();
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold">
      <ShieldCheck className="size-6 text-primary" />
      <span className="text-lg">{t("brand")}</span>
    </Link>
  );
}