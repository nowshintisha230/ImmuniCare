"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const items = NAV_ITEMS.filter((item) => !item.requiresAuth || user);

  return (
    <nav className={className}>
      {items.map((item) => {
        // only page links (not #sections) can be "current"
        const active =
          !item.href.includes("#") && (pathname === item.href || pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap text-xs font-medium text-muted-foreground transition-colors hover:text-foreground xl:text-sm",
              active && "font-bold text-primary underline decoration-2 underline-offset-8",
              linkClassName,
            )}
          >
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}