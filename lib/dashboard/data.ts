import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { DoseType } from "@/lib/vaccination/doses";
import {
  ageInMonths,
  ageParts,
  buildChildDoses,
  computeStats,
  startOfTodayDhaka,
  toDateKey,
} from "@/lib/vaccination/status";
import type { ChildView, DashboardData, NotificationView } from "./types";

const NOTIFY_WITHIN_DAYS = 3;
const TYPES: DoseType[] = ["government", "private"];

export async function getDashboardData(user: User): Promise<DashboardData> {
  const today = startOfTodayDhaka();

  const [children, feedback] = await Promise.all([
    prisma.child.findMany({
      where: { parentId: user.id },
      orderBy: { createdAt: "asc" },
      include: { records: true },
    }),
    prisma.feedback.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const overdueNotes: NotificationView[] = [];
  const upcomingNotes: NotificationView[] = [];

  const childViews: ChildView[] = children.map((child) => {
    const given = new Map(child.records.map((r) => [r.doseCode, r.givenAt]));
    const doses = buildChildDoses(child.dateOfBirth, given, today);

    const overdue: Record<DoseType, { count: number; names: string[] }> = {
      government: { count: 0, names: [] },
      private: { count: 0, names: [] },
    };

    for (const d of doses) {
      if (d.status === "due" && d.daysUntil < 0) {
        overdue[d.type].count += 1;
        if (!overdue[d.type].names.includes(d.name)) overdue[d.type].names.push(d.name);
      } else if (
        (d.status === "due" && d.daysUntil === 0) ||
        (d.status === "upcoming" && d.daysUntil <= NOTIFY_WITHIN_DAYS)
      ) {
        upcomingNotes.push({
          kind: "upcoming",
          id: `${child.id}:${d.code}`,
          childId: child.id,
          childName: child.name,
          vaccine: d.name,
          doseNumber: d.doseNumber,
          dueDate: d.dueDate,
          daysUntil: d.daysUntil,
          optional: d.type === "private",
        });
      }
    }

    for (const type of TYPES) {
      if (overdue[type].count > 0) {
        overdueNotes.push({
          kind: "overdue",
          id: `${child.id}:overdue:${type}`,
          childId: child.id,
          childName: child.name,
          doseType: type,
          count: overdue[type].count,
          vaccines: overdue[type].names,
        });
      }
    }

    return {
      id: child.id,
      name: child.name,
      dateOfBirth: toDateKey(child.dateOfBirth),
      sex: child.sex,
      ageMonths: ageInMonths(child.dateOfBirth, today),
      age: ageParts(child.dateOfBirth, today),
      doses,
      stats: computeStats(doses),
    };
  });

  
  overdueNotes.sort((a, b) => (a.kind === "overdue" && b.kind === "overdue" && a.doseType !== b.doseType ? (a.doseType === "government" ? -1 : 1) : 0));
  upcomingNotes.sort((a, b) =>
    a.kind === "upcoming" && b.kind === "upcoming" ? a.daysUntil - b.daysUntil : 0,
  );

  return {
    user: { name: user.name, email: user.email, phone: user.phone },
    children: childViews,
    notifications: [...overdueNotes, ...upcomingNotes],
    feedback: feedback.map((f) => ({
      id: f.id,
      rating: f.rating,
      message: f.message,
      approved: f.approved,
      createdAt: f.createdAt.toISOString(),
    })),
  };
}