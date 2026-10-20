"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH } from "@/lib/content/dashboard";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import { childSchema } from "@/lib/validations/dashboard";

const INITIAL = { childName: "", dateOfBirth: "", sex: "" };

export function AddChildForm({ onAdded }: { onAdded: () => void | Promise<void> }) {
  const { t, l } = useLanguage();
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [today, setToday] = useState<string | undefined>(undefined);

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  const set = (name: keyof typeof INITIAL) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [name]: e.target.value }));

  const err = (name: string) => (errors[name] ? t(errors[name] as TranslationKey) : undefined);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = childSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.error === "limit" ? l(DASH.children.limit) : t("error.generic"));
        return;
      }
      toast.success(l(DASH.children.added));
      setValues(INITIAL);
      await onAdded();
    } catch {
      toast.error(t("error.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{l(DASH.children.add)}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
          <div className="sm:col-span-2">
            <FormField id="add-childName" label={t("auth.childName")} error={err("childName")}>
              <Input id="add-childName" value={values.childName} onChange={set("childName")} />
            </FormField>
          </div>
          <FormField id="add-dob" label={t("auth.dob")} error={err("dateOfBirth")}>
            <Input id="add-dob" type="date" max={today} value={values.dateOfBirth} onChange={set("dateOfBirth")} />
          </FormField>
          <FormField id="add-sex" label={t("auth.sex")} error={err("sex")}>
            <NativeSelect id="add-sex" className="w-full" value={values.sex} onChange={set("sex")}>
              <option value="">{t("auth.selectSex")}</option>
              <option value="MALE">{t("auth.male")}</option>
              <option value="FEMALE">{t("auth.female")}</option>
              <option value="OTHER">{t("auth.other")}</option>
            </NativeSelect>
          </FormField>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? l(DASH.children.saving) : l(DASH.children.save)}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}