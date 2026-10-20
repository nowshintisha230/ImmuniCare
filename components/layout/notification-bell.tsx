"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { NotificationList } from "@/components/dashboard/notification-list";
import { useLanguage } from "@/components/providers/language-provider";
import { useNotifications } from "@/hooks/use-notifications";
import { USER_TEXT } from "@/lib/content/navbar";
import { SimplePopover } from "./simple-popover";

export function NotificationBell() {
  const { l } = useLanguage();
  const { items, reload } = useNotifications();
  const count = items.length;

  return (
    <SimplePopover
      label={l(USER_TEXT.notifications)}
      buttonClassName="relative"
      onOpen={reload}
      button={
        <>
          <Bell className="size-4" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-4 text-white">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </>
      }
    >
      {(close) => (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{l(USER_TEXT.notifications)}</p>
            <Link
              href="/dashboard?tab=notifications"
              onClick={close}
              className="text-xs font-medium text-primary hover:underline"
            >
              {l(USER_TEXT.viewAll)}
            </Link>
          </div>
          <NotificationList items={items} limit={5} />
        </div>
      )}
    </SimplePopover>
  );
}