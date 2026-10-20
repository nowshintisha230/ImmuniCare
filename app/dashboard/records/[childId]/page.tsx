import type { Metadata } from "next";
import { Suspense } from "react";
import { RecordReport } from "@/components/dashboard/record-report";

export const metadata: Metadata = { title: "Vaccination record" };

export default function RecordPage({ params }: { params: Promise<{ childId: string }> }) {
  return (
    <Suspense fallback={null}>
      <RecordReport params={params} />
    </Suspense>
  );
}