/**
 * Calculates password entropy based on character variety.
 * Higher entropy means a stronger password.
 * @param {string} password - The password string to evaluate.
 * @returns {number} - A numeric score reflecting character diversity.
 */
export const checkPasswordEntropy = (password: string):number => {
    let score = 0;

    if(/[a-z]/.test(password)) score += 10; // Lowercase letters
    if(/[A-Z]/.test(password)) score += 10; // Uppercase letters
    if(/[0-9]/.test(password)) score += 10; // Digits
    if(/[^a-zA-Z0-9\s]/.test(password)) score += 20; // Special characters (excluding spaces)
    if(password.includes(' ')) score += 5; // Spaces for entropy bonus

    return score;
}