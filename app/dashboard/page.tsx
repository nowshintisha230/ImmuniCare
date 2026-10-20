import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardClient />
    </Suspense>
  );
}