"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { useAuthUser } from "@/hooks/use-auth-user";
import { NAV_ITEMS } from "./nav-config";

type Props = {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
};

export function NavLinks({ className, linkClassName, onNavigate }: Props) {
  const { t } = useLanguage();
  const { user } = useAuthUser();

  const items = NAV_ITEMS.filter((item) => !item.requiresAuth || user);

  return (
    <nav className={className}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn("text-sm font-medium text-muted-foreground transition-colors hover:text-foreground", linkClassName)}
        >
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  );
}