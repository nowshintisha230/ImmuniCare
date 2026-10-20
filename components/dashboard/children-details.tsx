"use client";

import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH } from "@/lib/content/dashboard";
import type { ChildView } from "@/lib/dashboard/types";
import { formatAge, formatDateLong, formatTotalDays } from "@/lib/format";

const SEX_KEY = { MALE: "auth.male", FEMALE: "auth.female", OTHER: "auth.other" } as const;

export function ChildrenDetails({ items }: { items: ChildView[] }) {
  const { t, l, language } = useLanguage();

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="text-lg">{l(DASH.profile.childrenTitle)}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">{l(DASH.children.empty)}</p>}

        {items.map((child) => (
          <div key={child.id} className="flex flex-col gap-2 rounded-lg border p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">{child.name}</p>
              <span className="text-xs text-muted-foreground">{t(SEX_KEY[child.sex])}</span>
            </div>
            <p className="flex items-start gap-2 text-sm">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="text-muted-foreground">{l(DASH.profile.dob)}: </span>
                <span className="font-medium">{formatDateLong(child.dateOfBirth, language)}</span>
              </span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">{l(DASH.profile.age)}: </span>
              <span className="font-medium">{formatAge(child.age, language)}</span>
              <span className="text-xs text-muted-foreground">
                {" "}
                ({l(DASH.profile.totalDays)} {formatTotalDays(child.age.totalDays, language)})
              </span>
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}