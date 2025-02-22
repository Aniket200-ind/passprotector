//! lib/passwords/generator.ts

import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 *? Options for password generation
 */
export type PassswordOptions = {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
};

//* Define the path to wordlist
const WORDLIST_PATH = path.join(
  process.cwd(),
  "src/lib/passwords/wordlist.json"
);

//* Load the wordlist once into memory at startup
const wordlist = JSON.parse(fs.readFileSync(WORDLIST_PATH, "utf-8"));

//* Alowwed special symbols
const SYMBOLS = "!@#$%^&*()_+-={}[]<>?";

/**
 *? Securely generates a random password based on user preferences.
 *
 * @param {PassswordOptions} options - Password generation options.
 * @return {string} - The generated secure password.
 */
export const generateRandomPassword = (options: PassswordOptions): string => {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
  } = options;

  //* Validate password length
  if (length < 8 || length > 64) {
    throw new Error("Password length must be between 8 and 64 characters.");
  }

  //* Define character sets
  const UPPERCASE = "ABCDEFGHJKLMNPQRSTUVWXYZ"; //* Removed I and O for similarity avoidance
  const LOWERCASE = "abcdefghjkmnpqrstuvwxyz"; //* Removed i and o
  const NUMBERS = "1234567890";
  const SYMBOLS = "!@#$%^&*()_+-=[]{}|;':\",./<>?";

  //* Base character pool
  let charPool = "";

  if (includeUppercase) charPool += UPPERCASE;
  if (includeLowercase) charPool += LOWERCASE;
  if (includeNumbers) charPool += NUMBERS;
  if (includeSymbols) charPool += SYMBOLS;

  // Remove similar characters
  if (excludeSimilar) {
    charPool = charPool.replace(/[1lI0Oo]/g, "");
  }

  if (charPool.length === 0) {
    throw new Error("Atleast one character type must be selected");
  }

  //* Generate password
  const passwordArray = new Uint32Array(length);
  crypto.getRandomValues(passwordArray);

  return Array.from(
    passwordArray,
    (num) => charPool[num % charPool.length]
  ).join("");
};

/**
 *? Effeciently fetches a random word from a large JSON wordlist.
 *? Uses files streaming to avoid loading everything into memory.
 *
 * @returns {Promise<string>} - A randomly selected word.
 */
const getRandomWord = async (): Promise<string> => {
  try {
    const randomIndex = crypto.randomInt(0, wordlist.length);
    return wordlist[randomIndex];
  } catch (error) {
    console.error("[ERROR] Failed to get random word:", error);
    return "error";
  }
};

/**
 *? Generates a secure passphrase using a Diceware like appraoch.
 *
 * @param {number} wordCount - Number of words in the passphrase ()
 * @param {boolean} includeNumbers - Whether to add random numbers.
 * @param {boolean} includeSymbols - Whether to add random symbols.
 * @param {string} seperator - The seperator between words (space, hyphen, underscore).
 * @returns {Promise<string>} - The generated passphrase.
 */
export const generatePassphrase = async (
  wordCount: number,
  includeNumbers: boolean,
  includeSymbols: boolean,
  seperator: string
): Promise<string> => {
  //* Fetch words dynamically from the wordlist
  const passphraseWords = await Promise.all(
    Array.from({ length: wordCount }, () => getRandomWord())
  );

  //* Add optional numbers and symbols
  if (includeNumbers) passphraseWords.push(crypto.randomInt(0, 10).toString());

  if (includeSymbols)
    passphraseWords.push(SYMBOLS[crypto.randomInt(0, SYMBOLS.length - 1)]);

  //* Join words with the chosen seperator
  return passphraseWords.join(seperator);
};
