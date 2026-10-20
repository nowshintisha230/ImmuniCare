"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  collectRecords,
  EMPTY_RECORDS,
  InitialRecordsField,
  type RecordsValue,
} from "@/components/dashboard/initial-records-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/language-provider";
import { useTodayKey } from "@/hooks/use-today";
import { getAuthErrorKey, registerWithEmail } from "@/lib/auth-client";
import { DASH } from "@/lib/content/dashboard";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import { checkRecords } from "@/lib/vaccination/records";
import { startOfTodayDhaka, toDateKey } from "@/lib/vaccination/status";
import { registerSchema } from "@/lib/validations/auth";
import { AuthShell } from "./auth-shell";
import { FormField } from "./form-field";
import { GoogleButton } from "./google-button";
import { OrDivider } from "./or-divider";

const INITIAL = {
  childName: "",
  dateOfBirth: "",
  sex: "",
  parentName: "",
  email: "",
  phone: "",
  password: "",
};

type Values = typeof INITIAL;

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

export function RegisterForm() {
  const { t, l } = useLanguage();
  const router = useRouter();
  const today = useTodayKey();
  const [values, setValues] = useState<Values>(INITIAL);
  const [records, setRecords] = useState<RecordsValue>(EMPTY_RECORDS);
  const [recordsError, setRecordsError] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function bind(name: keyof Values) {
    return {
      id: name,
      value: values[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setValues((v) => ({ ...v, [name]: e.target.value })),
    };
  }

  const err = (name: keyof Values) =>
    errors[name] ? t(errors[name] as TranslationKey) : undefined;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[String(issue.path[0])] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});

    const list = records.enabled ? collectRecords(records) : [];
    const problem = list.length
      ? checkRecords(parsed.data.dateOfBirth, list, toDateKey(startOfTodayDhaka()))
      : null;
    if (problem) {
      setRecordsError(l(DASH.records.errors[problem]));
      return;
    }
    setRecordsError(undefined);

    setLoading(true);
    try {
      await registerWithEmail(parsed.data, list);
      toast.success(t("auth.registerSuccess"));
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(t(getAuthErrorKey(error)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title={t("auth.registerTitle")}
      description={t("auth.registerDesc")}
      footer={
        <>
          {t("auth.haveAccount")}{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t("auth.login")}
          </Link>
        </>
      }
    >
      <GoogleButton />
      <OrDivider />
      <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 text-sm font-semibold">{t("auth.childInfo")}</legend>
          <FormField id="childName" label={t("auth.childName")} error={err("childName")}>
            <Input autoComplete="off" {...bind("childName")} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="dateOfBirth" label={t("auth.dob")} error={err("dateOfBirth")}>
              <Input type="date" max={today} {...bind("dateOfBirth")} />
            </FormField>
            <FormField id="sex" label={t("auth.sex")} error={err("sex")}>
              <select className={selectClass} {...bind("sex")}>
                <option value="">{t("auth.selectSex")}</option>
                <option value="MALE">{t("auth.male")}</option>
                <option value="FEMALE">{t("auth.female")}</option>
                <option value="OTHER">{t("auth.other")}</option>
              </select>
            </FormField>
          </div>

          <InitialRecordsField
            value={records}
            onChange={setRecords}
            dob={values.dateOfBirth}
            todayKey={today}
            error={recordsError}
          />
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 text-sm font-semibold">{t("auth.parentInfo")}</legend>
          <FormField id="parentName" label={t("auth.parentName")} error={err("parentName")}>
            <Input autoComplete="name" {...bind("parentName")} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="email" label={t("auth.email")} error={err("email")}>
              <Input type="email" autoComplete="email" {...bind("email")} />
            </FormField>
            <FormField id="phone" label={t("auth.phone")} error={err("phone")}>
              <Input type="tel" autoComplete="tel" placeholder="+8801XXXXXXXXX" {...bind("phone")} />
            </FormField>
          </div>
          <FormField
            id="password"
            label={t("auth.password")}
            hint={t("auth.passwordHint")}
            error={err("password")}
          >
            <Input type="password" autoComplete="new-password" {...bind("password")} />
          </FormField>
        </fieldset>

        <Button type="submit" disabled={loading}>
          {loading ? t("auth.creating") : t("auth.register")}
        </Button>
      </form>
    </AuthShell>
  );
}