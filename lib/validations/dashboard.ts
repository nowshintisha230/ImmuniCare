import { z } from "zod";
import { DOSE_CODES } from "@/lib/vaccination/doses";
import { registerSchema } from "./auth";

export const childSchema = registerSchema.pick({
  childName: true,
  dateOfBirth: true,
  sex: true,
});

export const profileSchema = registerSchema.pick({
  parentName: true,
  phone: true,
});

export const markDoseSchema = z.object({
  doseCode: z.string().refine((c) => DOSE_CODES.has(c)),
  givenAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});