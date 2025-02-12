import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const SALT_LENGTH = 16; // Recommended salt length for password hashing
const ITERATIONS = 100000; //Adjust the number of iterations as per your security requirements
const KEY_LENGTH = 64; // 512 bits = 64 bytes
const DIGEST = 'sha512';

/**
 * Generates a secure SHA-512 hash using PBKDF2 algorithm
 * @param {string} password - The plaintext password to be hashed
 * @returns {string} - The hashed password in the format of "salt:hash"
 */
export const hashPassword = (password: string): string => {
    const salt = process.env.FIXED_SALT || crypto.randomBytes(SALT_LENGTH).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
    return `${salt}:${hash}`; // Store salt with hash for verification
}

/**
 * Verifies if a given password matches the stored hash
 * @param {string} password - The plaintext password to be verified
 * @param {string} storedHash - The stored hash in the format of "salt:hash"
 * @returns {boolean} - True if the password matches, false otherwise
 */
export const verfyPassword = (password: string, storedHash: string): boolean => {
    const [salt, hash] = storedHash.split(':');
    const hashToCompare = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
    return hash === hashToCompare;
};