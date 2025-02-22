//! lib/validation/generatorSchema.ts

import { z } from "zod";

/**
 * ? Zod schema for password generator API validation
 */
export const PasswordGeneratorSchema = z.object({
  length: z.number().min(8).max(64).default(16),
  includeUppercase: z.boolean().default(true),
  includeLowercase: z.boolean().default(true),
  includeNumbers: z.boolean().default(true),
  includeSymbols: z.boolean().default(true),
  excludeSimilar: z.boolean().default(false),
});

/**
 * ? Validation schema for the passphrase generator API.
 * ? Ensures user input adheres to latest security recommendations and standards.
 */
export const PassphraseGeneratorSchema = z.object({
  wordCount: z
    .number()
    .int()
    .min(6, { message: "Passphrase must be at least 6 words." })
    .max(8, { message: "Passphrase must be no more than 8 words." }),
  includeNumbers: z.boolean().default(false),
  includeSymbols: z.boolean().default(false),

  separator: z.enum([" ", "-", "_"]).default(" "),
});
