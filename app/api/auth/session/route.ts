import { NextResponse } from "next/server";
import { attachSessionCookie, clearSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "idToken required" }, { status: 400 });
    }
    return await attachSessionCookie(NextResponse.json({ ok: true }), idToken);
  } catch (error) {
    console.error("session error:", error);
    return NextResponse.json({ error: "Session failed" }, { status: 500 });
  }
}

export async function DELETE() {
  return clearSessionCookie(NextResponse.json({ ok: true }));
}