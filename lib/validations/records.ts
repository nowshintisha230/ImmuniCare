import { z } from "zod";
import { DOSE_CODES } from "@/lib/vaccination/doses";

export const recordInputSchema = z.object({
  doseCode: z.string().refine((c) => DOSE_CODES.has(c)),
  givenAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const recordsSchema = z.array(recordInputSchema).max(40).default([]);