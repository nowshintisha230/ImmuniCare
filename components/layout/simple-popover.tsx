"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  button: React.ReactNode;
  buttonClassName?: string;
  panelClassName?: string;
  onOpen?: () => void;
  children: (close: () => void) => React.ReactNode;
};

export function SimplePopover({ label, button, buttonClassName, panelClassName, onOpen, children }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) onOpen?.();
  }

  return (
    <div ref={ref} className="sm:relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={toggle}
        className={cn(
          "flex size-9 items-center justify-center rounded-full border bg-background transition-colors hover:bg-muted",
          buttonClassName,
        )}
      >
        {button}
      </button>

      {open && (
        <div
          className={cn(
            "absolute inset-x-4 top-full z-50 mt-2 rounded-xl border bg-popover p-3 text-popover-foreground shadow-lg sm:inset-x-auto sm:right-0 sm:w-80",
            panelClassName,
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}