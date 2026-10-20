import type { DoseView, Stats } from "@/lib/vaccination/status";

export type ChildView = {
  id: string;
  name: string;
  dateOfBirth: string;
  sex: "MALE" | "FEMALE" | "OTHER";
  ageMonths: number;
  doses: DoseView[];
  stats: Stats;
};

export type NotificationView = {
  id: string;
  childId: string;
  childName: string;
  vaccine: string;
  doseNumber: number;
  dueDate: string;
  daysUntil: number;
};

export type MyFeedbackView = {
  id: string;
  rating: number;
  message: string;
  approved: boolean;
  createdAt: string;
};

export type DashboardData = {
  user: { name: string | null; email: string; phone: string | null };
  children: ChildView[];
  summary: Stats & { children: number; totalVaccines: number };
  notifications: NotificationView[];
  feedback: MyFeedbackView[];
};