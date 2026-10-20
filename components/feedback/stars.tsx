"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { value: number; onChange?: (n: number) => void };

export function Stars({ value, onChange }: Props) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          aria-label={`${n} / 5`}
          className="disabled:cursor-default"
        >
          <Star className={cn("size-5", n <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
        </button>
      ))}
    </div>
  );
}