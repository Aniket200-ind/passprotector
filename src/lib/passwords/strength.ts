//! src/lib/passwords/strength.ts

import { checkLength } from "@/lib/passwords/lengthCheck";
import { isCommonPassword } from "./commonPatterns";
import { SCORE_THRESHOLD, StrengthRating } from "./strengthCriteria";
import { calculateEntropy } from "./entropyCheck";

/**
 *? Evaluates the overall strength of a password based on various checks.
 * @param {string} password - The password string to evaluate.
 * @return {Object} - An object containing the final strength rating and score.
 */
export const evaluatePasswordStrength = (
  password: string
): { rating: StrengthRating; score: number } => {
  console.log("[INFO] Starting strength analysis for password: ****");

  try {
    // **Input validation**
    if (typeof password !== "string" || password.trim() === "") {
      console.error("[ERROR] Invalid password input.");
      return { rating: StrengthRating.VULNERABLE, score: 0 };
    }

    let score = 0;

    // **Length check**
    const lengthScore = checkLength(password);
    score += lengthScore;
    console.log(`[DEBUG] Length score: ${lengthScore}`);

    // **Entropy check**
    const entropyScore = calculateEntropy(password);
    score += entropyScore;
    console.log(`[DEBUG] Entropy score: ${entropyScore}`);

    // **Common password check**
    if (isCommonPassword(password)) {
      console.warn(`[WARNING] Password detected as a common password.`);
      return { rating: StrengthRating.VULNERABLE, score: 0 };
    }

    // **Final strength rating**
    let rating: StrengthRating = StrengthRating.VULNERABLE;
    if (score >= SCORE_THRESHOLD.STRONG) rating = StrengthRating.STRONG;
    else if (score >= SCORE_THRESHOLD.MODERATE)
      rating = StrengthRating.MODERATE;
    else if (score >= SCORE_THRESHOLD.WEAK) rating = StrengthRating.WEAK;

    console.log(
      `[INFO] Password analysis complete. Score: ${score}, Rating: ${rating}`
    );

    return { rating, score };
  } catch (error) {
    console.error(`[ERROR] Unexpected error during password analysis:`, error);
    return { rating: StrengthRating.VULNERABLE, score: 0 };
  }
};
