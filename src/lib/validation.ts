// lib/utils/validation.ts
import { PasswordCategory, PasswordStrength } from "@prisma/client";
import { z } from "zod";

// Schema for creating a new password entry
export const PasswordCreateSchema = z.object({
  siteName: z.string().min(3, "Site name must be at least 3 characters long"),
  siteUrl: z.string().url(),
  password: z.string().min(8, "Password must be at least 8 characters").max(64, "Password too long"),
  category: z.nativeEnum(PasswordCategory).optional(),
  strength: z.nativeEnum(PasswordStrength).optional(),
  hashedPassword: z.string().optional(),
});

// Schema for updating an existing password entry
export const PasswordUpdateSchema = z.object({
  siteName: z.string().min(1, "Site name is required").optional(),
  siteUrl: z.string().url("Invalid URL").optional(),
  category: z.string().optional(),
  strength: z.enum(["Weak", "Medium", "Strong"]).optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  encryptedPassword: z.string().optional(),
  iv: z.string().optional(),
  authTag: z.string().optional(),
  hashedPassword: z.string().optional(),
});

  // Type inference from Zod
  export type PasswordCreateInput = z.infer<typeof PasswordCreateSchema>;