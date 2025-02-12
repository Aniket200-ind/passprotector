import commonPasswordsData from '@/lib/passwords/common-passwords.json';

/**
 * Convert the common passwords list into a Set for efficient lookups.
 */
const commonPasswords = new Set(commonPasswordsData);

/**
 * Checks if a password matches common patterns or dictionary words.
 * @param {string} password - The password string to evaluate.
 * @returns {number} - A negative score if the password matches a common pattern or dictionary word.
 */
export const checkForCommonPasswords = (password: string): number => {
    return commonPasswords.has(password.toLowerCase()) ? - 50 : 0;
}