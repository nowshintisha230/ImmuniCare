"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH } from "@/lib/content/dashboard";
import { REMINDER_TEXT } from "@/lib/content/reminders";
import type { DashboardData } from "@/lib/dashboard/types";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import { profileSchema } from "@/lib/validations/dashboard";

type Props = { user: DashboardData["user"]; onSaved: () => void | Promise<void> };

export function ProfileForm({ user, onSaved }: Props) {
  const { t, l } = useLanguage();
  const [values, setValues] = useState({ parentName: user.name ?? "", phone: user.phone ?? "" });
  const [emailReminders, setEmailReminders] = useState(user.emailReminders);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

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
        body: JSON.stringify({ ...parsed.data, emailReminders }),
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

  async function sendTest() {
    setTesting(true);
    try {
      const res = await fetch("/api/reminders/test", { method: "POST" });
      if (res.ok) toast.success(l(REMINDER_TEXT.testSent));
      else if (res.status === 429) toast.error(l(REMINDER_TEXT.testLimit));
      else if (res.status === 503) toast.error(l(REMINDER_TEXT.notConfigured));
      else toast.error(l(REMINDER_TEXT.testFailed));
    } catch {
      toast.error(l(REMINDER_TEXT.testFailed));
    } finally {
      setTesting(false);
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

          <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 size-4 accent-[var(--color-primary)]"
                checked={emailReminders}
                onChange={(e) => setEmailReminders(e.target.checked)}
              />
              <span>
                <span className="font-medium">{l(REMINDER_TEXT.label)}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{l(REMINDER_TEXT.hint)}</span>
              </span>
            </label>
            {user.emailReminders && (
              <Button type="button" variant="outline" size="sm" className="w-fit" disabled={testing} onClick={sendTest}>
                {l(REMINDER_TEXT.sendTest)}
              </Button>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? l(DASH.profile.saving) : l(DASH.profile.save)}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}