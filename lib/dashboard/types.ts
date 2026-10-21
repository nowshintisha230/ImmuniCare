import type { DoseType } from "@/lib/vaccination/doses";
import type { AgeParts, DoseView, Stats } from "@/lib/vaccination/status";

export type ChildView = {
  id: string;
  name: string;
  dateOfBirth: string;
  sex: "MALE" | "FEMALE" | "OTHER";
  ageMonths: number;
  age: AgeParts;
  doses: DoseView[];
  stats: Stats;
};

export type NotificationView =
  | {
      kind: "upcoming";
      id: string;
      childId: string;
      childName: string;
      vaccine: string;
      doseNumber: number;
      dueDate: string;
      daysUntil: number;
      optional: boolean;
    }
  | {
      kind: "overdue";
      id: string;
      childId: string;
      childName: string;
      doseType: DoseType;
      count: number;
      vaccines: string[];
    };

export type MyFeedbackView = {
  id: string;
  rating: number;
  message: string;
  approved: boolean;
  createdAt: string;
};

export type DashboardData = {
  user: { name: string | null; email: string; phone: string | null; emailReminders: boolean };
  children: ChildView[];
  notifications: NotificationView[];
  feedback: MyFeedbackView[];
};