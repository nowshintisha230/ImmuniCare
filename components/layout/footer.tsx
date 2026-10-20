"use client";


import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { useAuthUser } from "@/hooks/use-auth-user";
import { CATALOG } from "@/lib/content/vaccine-catalog";
import { VACCINE_SLUGS } from "@/lib/content/vaccine-details";
import { VACCINES } from "@/lib/content/vaccine-info";
import { FOOTER_TEXT } from "@/lib/content/footer";
import { Logo } from "./logo";
import { NAV_ITEMS } from "./nav-config";

type FooterLink = { href: string; label: string };

function Column({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
      const pathname = usePathname();
  const { l, t } = useLanguage();
  const { user } = useAuthUser();

  const explore = NAV_ITEMS.filter((i) => !i.requiresAuth).map((i) => ({ href: i.href, label: t(i.labelKey) }));

  const vaccines = CATALOG.filter((v) => v.type === "government").map((v) => ({
    href: `/vaccines/${VACCINE_SLUGS[v.key]}`,
    label: VACCINES[v.key].name,
  }));

  const account: FooterLink[] = user
    ? [
        { href: "/dashboard", label: t("nav.dashboard") },
        { href: "/dashboard?tab=profile", label: l(FOOTER_TEXT.profile) },
        { href: "/ai-assistant", label: t("nav.assistant") },
      ]
    : [
        { href: "/login", label: t("auth.login") },
        { href: "/register", label: t("auth.register") },
        { href: "/ai-assistant", label: t("nav.assistant") },
      ];

  return (
        <footer className={cn("border-t bg-card", pathname.startsWith("/dashboard") && "max-lg:hidden")}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-muted-foreground">{l(FOOTER_TEXT.tagline)}</p>
          <p className="text-xs font-medium text-destructive">{l(FOOTER_TEXT.emergency)}</p>
        </div>
        <Column title={l(FOOTER_TEXT.explore)} links={explore} />
        <Column title={l(FOOTER_TEXT.vaccines)} links={vaccines} />
        <Column title={l(FOOTER_TEXT.account)} links={account} />
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl">{l(FOOTER_TEXT.disclaimer)}</p>
          <p>© {l(FOOTER_TEXT.rights)}</p>
        </div>
      </div>
    </footer>
  );
}