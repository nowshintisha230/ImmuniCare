"use client";

import { useEffect, useState } from "react";
import { startOfTodayDhaka, toDateKey } from "@/lib/vaccination/status";


export function useTodayKey() {
  const [key, setKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    setKey(toDateKey(startOfTodayDhaka()));
  }, []);

  return key;
}