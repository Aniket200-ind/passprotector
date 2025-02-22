//! src/lib/passwords/strengthCriteria.ts

/**
 *? Defines password strength criteria based on NIST guidelines.
 */

export const MIN_LENGTH = 8;
export const RECOMMENDED_LENGTH = 15;
export const MAX_LENGTH = 64;

/**
 *? Defines scoring thresholds for password strength evaluation.
 */

export const SCORE_THRESHOLD = {
  VULNERABLE: 0,
  WEAK: 30,
  MODERATE: 60,
  STRONG: 80,
} as const;

/**
 *? Strength ratings based on score
 */

export enum StrengthRating {
  VULNERABLE = "Vulnerable",
  WEAK = "Weak",
  MODERATE = "Moderate",
  STRONG = "Strong",
}
