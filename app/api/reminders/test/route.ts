import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { buildReminderEmail } from "@/lib/email/reminder-template";
import { mailConfigured, sendMail } from "@/lib/email/mailer";
import { appUrl, unsubscribeUrl } from "@/lib/email/unsubscribe";
import { prisma } from "@/lib/prisma";
import { startOfTodayDhaka, toDateKey } from "@/lib/vaccination/status";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!mailConfigured()) return NextResponse.json({ error: "not-configured" }, { status: 503 });
  if (user.email.endsWith("@no-email.local")) return NextResponse.json({ error: "no-email" }, { status: 400 });

  const dayKey = toDateKey(startOfTodayDhaka());

  // one test email per day
  try {
    await prisma.reminderLog.create({ data: { userId: user.id, childId: "user", kind: "TEST", key: dayKey } });
  } catch {
    return NextResponse.json({ error: "limit" }, { status: 429 });
  }

  try {
    const url = unsubscribeUrl(user.id);
    const mail = buildReminderEmail({
      parentName: user.name ?? "",
      reminders: [
        {
          childName: "Sample child / নমুনা শিশু",
          today: [{ name: "Pentavalent", doseNumber: 1, dueDate: dayKey }],
          soon: [],
          overdue: [],
        },
      ],
      unsubscribeUrl: url,
      appUrl: appUrl(),
    });
    await sendMail({ to: user.email, ...mail, headers: { "List-Unsubscribe": `<${url}>` } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("test email failed:", error);
    await prisma.reminderLog.deleteMany({ where: { childId: "user", kind: "TEST", key: dayKey, userId: user.id } });
    return NextResponse.json({ error: "send-failed" }, { status: 502 });
  }
}