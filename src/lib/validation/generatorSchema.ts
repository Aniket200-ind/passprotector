//! lib/validation/generatorSchema.ts

import { z } from "zod";

/**
 * ? Zod schema for password generator API validation
 */
export const PasswordGeneratorSchema = z.object({
  length: z.number().min(8).max(64).default(16),
  includeUppercase: z.boolean(),
  includeLowercase: z.boolean(),
  includeNumbers: z.boolean(),
  includeSymbols: z.boolean(),
  excludeSimilar: z.boolean(),
});

/**
 * ? Validation schema for the passphrase generator API.
 * ? Ensures user input adheres to latest security recommendations and standards.
 */
export const PassphraseGeneratorSchema = z.object({
  wordCount: z
    .number()
    .int()
    .min(4, { message: "Passphrase must be at least 4 words." })
    .max(12, { message: "Passphrase must be no more than 12 words." }),
  includeNumbers: z.boolean().default(false),
  includeSymbols: z.boolean().default(false),

  separator: z.enum([" ", "-", "_", "."]).default(" "),
});
