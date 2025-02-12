import { checkPasswordLength } from "./lengthCheck";
import { checkPasswordEntropy } from "./entropyCheck";
import { checkForCommonPasswords } from "./commonPatterns";
import { SCORE_THRESHOLD, StrengthRating } from "./strengthCriteria";

/**
 * Evaluates the overall strength of a password based on various checks.
 * @param {string} password - The password string to evaluate.
 * @return {Object} - An object containing the final strength rating and score.
 */
export const evaluatePasswordStrength = (password: string): { rating: StrengthRating, score: number } => {
    let score = 0;

    score += checkPasswordLength(password);
    score += checkPasswordEntropy(password);
    score += checkForCommonPasswords(password);

    let rating: StrengthRating = StrengthRating.VULNERABLE;
    if (score >= SCORE_THRESHOLD.WEAK) rating = StrengthRating.WEAK;
    else if (score >= SCORE_THRESHOLD.MODERATE) rating = StrengthRating.MODERATE;
    else if (score >= SCORE_THRESHOLD.STRONG) rating = StrengthRating.STRONG;

    return { rating, score };
}