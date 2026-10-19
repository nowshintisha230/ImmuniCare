"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/language-provider";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import { getAuthErrorKey, loginWithEmail } from "@/lib/auth-client";
import { loginSchema } from "@/lib/validations/auth";
import { AuthShell } from "./auth-shell";
import { FormField } from "./form-field";
import { GoogleButton } from "./google-button";
import { OrDivider } from "./or-divider";

export function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[String(issue.path[0])] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await loginWithEmail(parsed.data);
      toast.success(t("auth.loginSuccess"));
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
      title={t("auth.loginTitle")}
      description={t("auth.loginDesc")}
      footer={
        <>
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            {t("auth.register")}
          </Link>
        </>
      }
    >
      <GoogleButton />
      <OrDivider />
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <FormField id="email" label={t("auth.email")} error={errors.email && t(errors.email as TranslationKey)}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
        </FormField>
        <FormField id="password" label={t("auth.password")} error={errors.password && t(errors.password as TranslationKey)}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          />
        </FormField>
        <Button type="submit" disabled={loading}>
          {loading ? t("auth.signingIn") : t("auth.login")}
        </Button>
      </form>
    </AuthShell>
  );
}