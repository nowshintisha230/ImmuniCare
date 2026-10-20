"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/language-provider";
import { logout } from "@/lib/auth-client";
import { USER_TEXT } from "@/lib/content/navbar";
import { SimplePopover } from "./simple-popover";

const itemClass =
  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted";

export function ProfileMenu({ user }: { user: User }) {
  const { l } = useLanguage();
  const router = useRouter();

  const name = user.displayName ?? user.email ?? "";
  const initial = (name.trim()[0] ?? "U").toUpperCase();

  async function handleLogout(close: () => void) {
    try {
      await logout();
      close();
      router.replace("/");
      router.refresh();
    } catch {
      toast.error(l(USER_TEXT.logoutFailed));
    }
  }

  return (
    <SimplePopover
      label={l(USER_TEXT.account)}
      buttonClassName="bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      panelClassName="sm:w-64"
      button={<span aria-hidden="true">{initial}</span>}
    >
      {(close) => (
        <div className="flex flex-col gap-1">
          <div className="mb-1 border-b px-2 pb-2">
            <p className="truncate text-sm font-semibold">{user.displayName ?? name}</p>
            {user.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
          </div>
          <Link href="/dashboard" onClick={close} className={itemClass}>
            <LayoutDashboard className="size-4" />
            {l(USER_TEXT.dashboard)}
          </Link>
          <Link href="/dashboard?tab=profile" onClick={close} className={itemClass}>
            <UserRound className="size-4" />
            {l(USER_TEXT.profile)}
          </Link>
          <button type="button" onClick={() => handleLogout(close)} className={`${itemClass} text-destructive`}>
            <LogOut className="size-4" />
            {l(USER_TEXT.logout)}
          </button>
        </div>
      )}
    </SimplePopover>
  );
}