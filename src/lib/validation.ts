// lib/utils/validation.ts
import { z } from "zod";

// Schema for creating a new password entry
export const PasswordCreateSchema = z.object({
  siteName: z.string().min(3, "Site name must be at least 3 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(64, "Password too long"),
  category: z.enum(["personal", "work", "finance"]).optional(),
});

// Type inference from Zod
export type PasswordCreateInput = z.infer<typeof PasswordCreateSchema>;
