"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLanguage } from "@/components/providers/language-provider";
import { AuthActions } from "./auth-actions";
import { LanguageToggle } from "./language-toggle";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";

export function Navbar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Logo />

        {/* Desktop */}
        <NavLinks className="hidden items-center gap-5 xl:flex" />
        <div className="hidden items-center gap-2 xl:flex">
          <LanguageToggle />
          <AuthActions className="flex items-center gap-2" />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 xl:hidden">
          <LanguageToggle />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t("ui.menu")}
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{t("ui.menu")}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4">
            <NavLinks
              className="flex flex-col gap-4"
              linkClassName="text-base"
              onNavigate={() => setOpen(false)}
            />
            <AuthActions className="flex flex-col gap-2" onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}