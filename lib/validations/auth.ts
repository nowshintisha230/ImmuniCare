import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("error.email"),
  password: z.string().min(1, "error.password"),
});

export const registerSchema = z.object({
  childName: z.string().trim().min(2, "error.childName").max(80, "error.childName"),
  dateOfBirth: z.string().refine((v) => {
    const d = new Date(v);
    return !Number.isNaN(d.getTime()) && d <= new Date();
  }, "error.dob"),
  sex: z.enum(["MALE", "FEMALE", "OTHER"], { message: "error.sex" }),
  parentName: z.string().trim().min(2, "error.parentName").max(80, "error.parentName"),
  email: z.string().trim().email("error.email"),
  phone: z.string().trim().regex(/^\+?[0-9]{10,15}$/, "error.phone"),
  password: z.string().min(8, "error.password"),
});

export const registerProfileSchema = registerSchema.omit({ password: true });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterProfileInput = z.infer<typeof registerProfileSchema>;