import commonPasswordsData from "./common-passwords.json";

/**
 * Load the commmon passwords from the JSON file into memory (only once)
 */

const commonPasswords = new Set(commonPasswordsData);


/**
 * Checks if the given password is in the common passwords list.
 * @param {string} password - The password to check.
 * @returns {boolean} `true` if the password is common, otherwise `false`.
 */
export const isCommonPassword = (password: string): boolean => {
  try {
    // **Validate input**
    if (typeof password !== "string" || password.trim() === "") {
      console.error("[ERROR] Invalid password input for common pattern check.");
      return false;
    }

    // **Check if the password is common**
    const isCommon = commonPasswords.has(password);
    if (isCommon) {
      console.warn(`[WARNING] Password is a common password.`);
    }

    return isCommon;
  } catch (error) {
    console.error("[ERROR] Failed to check common passwords:", error);
    return false;
  }
};
