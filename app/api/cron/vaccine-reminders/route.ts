import { timingSafeEqual } from "node:crypto";
import { connection, NextResponse } from "next/server";
import { runReminders } from "@/lib/reminders/run";

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const a = Buffer.from(req.headers.get("authorization") ?? "");
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  await connection();
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    return NextResponse.json(await runReminders());
  } catch (error) {
    console.error("reminder run failed:", error);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}