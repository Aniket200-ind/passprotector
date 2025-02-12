import { MIN_LENGTH, RECOMMENDED_LENGTH,MAX_LENGTH } from "./strengthCriteria";

/**
 * Checks if a password meets the required length criteria.
 * @param {string} password - The password string to evaluate.
 * @returns {number} - A numberic score indicating compliance with length requirements.
 */
export const checkPasswordLength = (password: string): number => {
    const length = password.length;

    if (length < MIN_LENGTH) return 0;

    if (length >= RECOMMENDED_LENGTH) return 40; // Bonus points for longer passwords

    if (length <= MAX_LENGTH) return 20;

    return 10;
}