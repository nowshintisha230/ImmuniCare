"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { RECORD_TEXT } from "@/lib/content/record";
import { cn } from "@/lib/utils";

type Props = {
  childId: string;
  /** hide the text on small screens and show only the icon */
  compact?: boolean;
  className?: string;
};

export function RecordDownloadButton({ childId, compact, className }: Props) {
  const { l } = useLanguage();
  const label = l(RECORD_TEXT.download);

  return (
    <Link
      href={`/dashboard/records/${childId}?print=1`}
      prefetch={false}
      aria-label={label}
      title={label}
      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0", className)}
    >
      <Download className="size-4" />
      <span className={compact ? "hidden sm:inline" : undefined}>{label}</span>
    </Link>
  );
}