"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { useAuthUser } from "@/hooks/use-auth-user";
import { cn } from "@/lib/utils";

type Props = { className?: string; onNavigate?: () => void };

export function GuestActions({ className, onNavigate }: Props) {
  const { t } = useLanguage();
  const { user, loading } = useAuthUser();

  if (loading || user) return null;

  return (
    <div className={className}>
      <Link
        href="/login"
        onClick={onNavigate}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "whitespace-nowrap")}
      >
        {t("auth.login")}
      </Link>
      <Link
        href="/register"
        onClick={onNavigate}
        className={cn(buttonVariants({ size: "sm" }), "whitespace-nowrap")}
      >
        {t("auth.register")}
      </Link>
    </div>
  );
}