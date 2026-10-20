"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH } from "@/lib/content/dashboard";
import type { DashboardData } from "@/lib/dashboard/types";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import { profileSchema } from "@/lib/validations/dashboard";

type Props = { user: DashboardData["user"]; onSaved: () => void | Promise<void> };

export function ProfileForm({ user, onSaved }: Props) {
  const { t, l } = useLanguage();
  const [values, setValues] = useState({ parentName: user.name ?? "", phone: user.phone ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const err = (name: string) => (errors[name] ? t(errors[name] as TranslationKey) : undefined);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = profileSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error();
      toast.success(l(DASH.profile.saved));
      await onSaved();
    } catch {
      toast.error(t("error.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="text-lg">{l(DASH.profile.title)}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <FormField id="p-name" label={t("auth.parentName")} error={err("parentName")}>
            <Input
              id="p-name"
              value={values.parentName}
              onChange={(e) => setValues((v) => ({ ...v, parentName: e.target.value }))}
            />
          </FormField>
          <FormField id="p-phone" label={t("auth.phone")} error={err("phone")}>
            <Input
              id="p-phone"
              type="tel"
              value={values.phone}
              placeholder="+8801XXXXXXXXX"
              onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            />
          </FormField>
          <FormField id="p-email" label={t("auth.email")} hint={l(DASH.profile.emailLocked)}>
            <Input id="p-email" value={user.email} disabled readOnly />
          </FormField>
          <Button type="submit" disabled={loading}>
            {loading ? l(DASH.profile.saving) : l(DASH.profile.save)}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}