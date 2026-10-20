"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { NotificationView } from "@/lib/dashboard/types";

export function useNotifications() {
  const pathname = usePathname();
  const [items, setItems] = useState<NotificationView[]>([]);

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) {
        setItems([]);
        return;
      }
      const data = await res.json();
      setItems(data.notifications ?? []);
    } catch {
      // keep the previous list
    }
  }, []);

  // reload on mount and on every route change (e.g. right after login)
  useEffect(() => {
    reload();
  }, [reload, pathname]);

  return { items, reload };
}