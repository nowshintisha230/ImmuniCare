"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { COUNTS, type VaccineType } from "@/lib/content/vaccine-catalog";
import { CATALOG_TEXT } from "@/lib/content/vaccine-sections";
import { cn } from "@/lib/utils";

type Props = { value: VaccineType; onChange: (v: VaccineType) => void };

export function TypeSwitch({ value, onChange }: Props) {
  const { l } = useLanguage();
  const options: VaccineType[] = ["government", "private"];

  return (
    <div className="mx-auto mb-8 flex w-full max-w-md rounded-full border bg-card p-1 shadow-sm">
      {options.map((type) => {
        const active = value === type;
        return (
          <button
            key={type}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(type)}
            className={cn(
              "flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
              active
                ? type === "government"
                  ? "bg-[#006a4e] text-white shadow"
                  : "bg-amber-500 text-white shadow"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l(CATALOG_TEXT.types[type])} ({COUNTS[type]})
          </button>
        );
      })}
    </div>
  );
}