import type { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

export const SESSION_COOKIE = "session";
const EXPIRES_IN_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function attachSessionCookie(res: NextResponse, idToken: string) {
  const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
    expiresIn: EXPIRES_IN_MS,
  });
  res.cookies.set(SESSION_COOKIE, sessionCookie, {
    maxAge: EXPIRES_IN_MS / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return res;
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}