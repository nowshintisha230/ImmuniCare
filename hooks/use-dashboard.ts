"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { DashboardData } from "@/lib/dashboard/types";

export function useDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (res.status === 401) {
        // clear a stale cookie first, otherwise proxy.ts bounces /login back to /dashboard
        await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
        router.replace("/login");
        return;
      }
      if (!res.ok) throw new Error();
      setData(await res.json());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}