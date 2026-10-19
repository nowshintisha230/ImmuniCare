import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const COOKIE_NAME = "session";
const EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "idToken required" }, { status: 400 });
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, sessionCookie, {
      maxAge: EXPIRES_IN / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}