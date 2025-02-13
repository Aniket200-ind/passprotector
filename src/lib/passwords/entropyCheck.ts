/**
 * Calculates password entropy based on character diversity.
 * @param password - The password to analyze.
 * @returns {number} Entropy score.
 */
export const calculateEntropy = (password: string): number => {
  try {
    let score = 0;

    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/\d/.test(password)) score += 20;
    if (/[^a-zA-Z0-9\s]/.test(password)) score += 20; // Special chars, excluding spaces

    return score;
  } catch (error) {
    console.error("[ERROR] Entropy calculation failed:", error);
    return 0;
  }
};
