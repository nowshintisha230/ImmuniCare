"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { useAuthUser } from "@/hooks/use-auth-user";
import { logout } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  onNavigate?: () => void;
};

export function AuthActions({ className, onNavigate }: Props) {
  const { t } = useLanguage();
  const { user, loading } = useAuthUser();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      onNavigate?.();
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  }

  if (loading) return <div className={cn("h-8 w-32", className)} />;

  if (user) {
    return (
      <div className={className}>
        <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
          {t("auth.logout")}
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Link href="/login" onClick={onNavigate} className={buttonVariants({ variant: "ghost", size: "sm" })}>
        {t("auth.login")}
      </Link>
      <Link href="/register" onClick={onNavigate} className={buttonVariants({ size: "sm" })}>
        {t("auth.register")}
      </Link>
    </div>
  );
}