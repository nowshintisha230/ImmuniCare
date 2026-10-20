"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLanguage } from "@/components/providers/language-provider";
import { GuestActions } from "./guest-actions";
import { LanguageToggle } from "./language-toggle";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { UserActions } from "./user-actions";

export function Navbar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4">
        <Logo />

        <NavLinks className="hidden min-w-0 items-center gap-3 lg:flex xl:gap-5" />

        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <UserActions />
          <GuestActions className="hidden items-center gap-2 lg:flex" />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="lg:hidden"
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
            <GuestActions className="flex flex-col gap-2" onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}