import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { VACCINE_COUNT } from "@/lib/vaccination/doses";
import {
  ageInMonths,
  buildChildDoses,
  computeStats,
  startOfTodayDhaka,
  toDateKey,
} from "@/lib/vaccination/status";
import type { ChildView, DashboardData, NotificationView } from "./types";

const NOTIFY_WITHIN_DAYS = 3;

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

  const notifications: NotificationView[] = [];

  const childViews: ChildView[] = children.map((child) => {
    const given = new Map(child.records.map((r) => [r.doseCode, r.givenAt]));
    const doses = buildChildDoses(child.dateOfBirth, given, today);

    for (const d of doses) {
      if (d.status !== "completed" && d.daysUntil >= 0 && d.daysUntil <= NOTIFY_WITHIN_DAYS) {
        notifications.push({
          id: `${child.id}:${d.code}`,
          childId: child.id,
          childName: child.name,
          vaccine: d.name,
          doseNumber: d.doseNumber,
          dueDate: d.dueDate,
          daysUntil: d.daysUntil,
        });
      }
    }

    return {
      id: child.id,
      name: child.name,
      dateOfBirth: toDateKey(child.dateOfBirth),
      sex: child.sex,
      ageMonths: ageInMonths(child.dateOfBirth, today),
      doses,
      stats: computeStats(doses),
    };
  });

  notifications.sort((a, b) => a.daysUntil - b.daysUntil);

  const all = childViews.flatMap((c) => c.doses);

  return {
    user: { name: user.name, email: user.email, phone: user.phone },
    children: childViews,
    summary: {
      ...computeStats(all),
      children: childViews.length,
      totalVaccines: childViews.length * VACCINE_COUNT,
    },
    notifications,
    feedback: feedback.map((f) => ({
      id: f.id,
      rating: f.rating,
      message: f.message,
      approved: f.approved,
      createdAt: f.createdAt.toISOString(),
    })),
  };
}