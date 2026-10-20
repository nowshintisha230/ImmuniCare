"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { DashboardData } from "@/lib/dashboard/types";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";


export function useDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (res.status === 401) {
  await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
  await signOut(firebaseAuth).catch(() => {});
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