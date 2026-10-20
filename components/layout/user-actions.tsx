"use client";

import { useAuthUser } from "@/hooks/use-auth-user";
import { NotificationBell } from "./notification-bell";
import { ProfileMenu } from "./profile-menu";

export function UserActions() {
  const { user } = useAuthUser();
  if (!user) return null;

  return (
    <div className="flex items-center gap-1.5">
      <NotificationBell />
      <ProfileMenu user={user} />
    </div>
  );
}