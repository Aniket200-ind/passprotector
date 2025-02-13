/**
 * Checks the length of the password and assigns a score.
 * @param password - The password to check.
 * @returns {number} Length-based score.
 */
export const checkLength = (password: string): number => {
  try {
    const length = password.length;

    if (length >= 12) return 30;
    if (length >= 8) return 20;
    if (length >= 6) return 10;

    return 0;
  } catch (error) {
    console.error("[ERROR] Failed in lengthCheck:", error);
    return 0;
  }
};
