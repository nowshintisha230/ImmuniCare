import { z } from "zod";

export const feedbackSchema = z.object({
  name: z.string().trim().min(2).max(60),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(10).max(500),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;