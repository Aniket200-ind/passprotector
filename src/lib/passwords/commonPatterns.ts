import fs from "fs";
import path from "path";

// Lazy-loaded cache for common passwords
let commonPasswords: Set<string> | null = null;

/**
 * Load the commmon passwords from the JSON file into memory (only once)
 */

const loadCommonPasswords = (): Set<string> => {
  if(!commonPasswords) {
    const filePath = path.join(process.cwd(), "src/lib/passwords/common-passwords.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const passwordList: string[] = JSON.parse(rawData);
    commonPasswords = new Set(passwordList);
  }
  return commonPasswords;
}


/**
 * Checks if the given password is in the common passwords list.
 * @param password - The password to check.
 * @returns {boolean} `true` if the password is common, otherwise `false`.
 */
export const isCommonPassword = (password: string): boolean => {
  try {
    // **Load common passwords**
    const commonPasswords = loadCommonPasswords();
    
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
