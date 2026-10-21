
import type { Prisma } from "@prisma/client";
import { buildReminderEmail, type ChildReminder, type DoseLine } from "@/lib/email/reminder-template";
import { mailConfigured, sendMail } from "@/lib/email/mailer";
import { appUrl, unsubscribeUrl } from "@/lib/email/unsubscribe";
import { prisma } from "@/lib/prisma";
import { buildChildDoses, DAY_MS, startOfTodayDhaka } from "@/lib/vaccination/status";

/** Set true to also email about private (optional) vaccines. */
const INCLUDE_PRIVATE = false;
const MAX_EMAILS_PER_RUN = 60;
const TIME_BUDGET_MS = 8000;
const USERS_PER_PAGE = 50;
const CONCURRENCY = 5;

type UserWithChildren = Prisma.UserGetPayload<{ include: { children: { include: { records: true } } } }>;
type Candidate = { childId: string; kind: "BEFORE3" | "TODAY" | "OVERDUE"; key: string; lines: DoseLine[] };
type Outcome = "sent" | "failed" | "skipped";

function candidatesFor(user: UserWithChildren, today: Date, weekKey: string) {
  const out: Candidate[] = [];

  for (const child of user.children) {
    const given = new Map(child.records.map((r) => [r.doseCode, r.givenAt]));
    const doses = buildChildDoses(child.dateOfBirth, given, today).filter(
      (d) => INCLUDE_PRIVATE || d.type === "government",
    );

    const overdue: DoseLine[] = [];
    for (const d of doses) {
      if (d.status === "completed" || d.status === "missed") continue;
      const line: DoseLine = { name: d.name, doseNumber: d.doseNumber, dueDate: d.dueDate };

      if (d.daysUntil === 0) out.push({ childId: child.id, kind: "TODAY", key: d.code, lines: [line] });
      else if (d.daysUntil >= 1 && d.daysUntil <= 3) out.push({ childId: child.id, kind: "BEFORE3", key: d.code, lines: [line] });
      else if (d.daysUntil < 0) overdue.push(line);
    }
    if (overdue.length) out.push({ childId: child.id, kind: "OVERDUE", key: weekKey, lines: overdue });
  }
  return out;
}

async function processUser(user: UserWithChildren, today: Date, weekKey: string): Promise<Outcome> {
  const candidates = candidatesFor(user, today, weekKey);
  if (candidates.length === 0) return "skipped";

  const existing = await prisma.reminderLog.findMany({
    where: { userId: user.id, OR: candidates.map((c) => ({ childId: c.childId, kind: c.kind, key: c.key })) },
    select: { childId: true, kind: true, key: true },
  });
  const seen = new Set(existing.map((e) => `${e.childId}|${e.kind}|${e.key}`));
  const fresh = candidates.filter((c) => !seen.has(`${c.childId}|${c.kind}|${c.key}`));
  if (fresh.length === 0) return "skipped";

  const reminders: ChildReminder[] = [];
  for (const child of user.children) {
    const mine = fresh.filter((c) => c.childId === child.id);
    if (mine.length === 0) continue;
    reminders.push({
      childName: child.name,
      today: mine.filter((c) => c.kind === "TODAY").flatMap((c) => c.lines),
      soon: mine.filter((c) => c.kind === "BEFORE3").flatMap((c) => c.lines),
      overdue: mine.filter((c) => c.kind === "OVERDUE").flatMap((c) => c.lines),
    });
  }

  // claim first, so a double cron delivery cannot send the same reminder twice
  const rows = fresh.map((c) => ({ userId: user.id, childId: c.childId, kind: c.kind, key: c.key }));
  await prisma.reminderLog.createMany({ data: rows, skipDuplicates: true });

  try {
    const url = unsubscribeUrl(user.id);
    const mail = buildReminderEmail({
      parentName: user.name ?? "",
      reminders,
      unsubscribeUrl: url,
      appUrl: appUrl(),
    });
    await sendMail({
      to: user.email,
      ...mail,
      headers: { "List-Unsubscribe": `<${url}>` },
    });
    return "sent";
  } catch (error) {
    console.error("reminder email failed:", error);
    // release the claim so tomorrow's run can try again
    await prisma.reminderLog.deleteMany({
      where: { OR: rows.map((r) => ({ childId: r.childId, kind: r.kind, key: r.key })) },
    });
    return "failed";
  }
}

export async function runReminders() {
  if (!mailConfigured()) return { ok: false as const, error: "mail-not-configured" };

  const started = Date.now();
  const today = startOfTodayDhaka();
  const weekKey = String(Math.floor(today.getTime() / (7 * DAY_MS)));
  const stats = { sent: 0, failed: 0, skipped: 0, stoppedEarly: false };

  let cursor: string | undefined;

  outer: while (true) {
    const users: UserWithChildren[] = await prisma.user.findMany({
      where: {
        emailReminders: true,
        NOT: { email: { endsWith: "@no-email.local" } },
        children: { some: {} },
      },
      orderBy: { id: "asc" },
      take: USERS_PER_PAGE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: { children: { include: { records: true } } },
    });
    if (users.length === 0) break;
    cursor = users[users.length - 1].id;

    for (let i = 0; i < users.length; i += CONCURRENCY) {
      if (stats.sent + stats.failed >= MAX_EMAILS_PER_RUN || Date.now() - started > TIME_BUDGET_MS) {
        stats.stoppedEarly = true;
        break outer;
      }
      const results = await Promise.all(
        users.slice(i, i + CONCURRENCY).map((u) => processUser(u, today, weekKey)),
      );
      for (const r of results) stats[r] += 1;
    }
  }

  return { ok: true as const, ...stats };
}