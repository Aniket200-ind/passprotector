import crypto from "crypto";
import { EncryptedData } from "../types";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.AES_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("Missing AES_SECRET_KEY in environment variables.");
}

if(SECRET_KEY.length !== 64) {
  throw new Error("AES_SECRET_KEY must be a 32-byte key represented as a 64-character hex string.");
}


// !Convert the HEX key to a buffer for cryptographic operations
const keyBuffer = Buffer.from(SECRET_KEY, "hex");

/**
 * Encrypts a given plaintext using AES-256-GCM
 * @param plaintext - The data to be encrypted
 * @returns An object containing the encrypted data, IV, and the authentication tag.
 */
export const encryptAESGCM = (plaintext: string): EncryptedData => {
  //* Generate a 12-byte IV
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, iv);

  let encrypted = cipher.update(plaintext, "utf-8", "base64");
  encrypted += cipher.final("base64");

  //* Retrieve the authentication tag
  const authTag = cipher.getAuthTag();

  return {
    encryptedText: encrypted,
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}


/**
 * Decrypts a given encrypted text using AES-256-GCM
 * 
 * @param {Object} data - The encrypted data object.
 * @param {string} data.encryptedText - The encrypted text in base64 format.
 * @param {string} data.iv - The initialization vector(IV) in base64 format.
 * @param {string} data.authTag - The authentication tag in base64 format.
 * @returns {string} - The decrypted plaintext.
 * 
 * @throws {Error} - If the decryption fails due to an invalid key, IV, or auth tag.
 */

export const decryptAESGCM = ({
  encryptedText,
  iv,
  authTag,
}: EncryptedData): string => {
  try{
    //* Convert base64-encoded IV and authTag back to Buffers
    const ivBuffer = Buffer.from(iv, "base64");
    const authTagBuffer = Buffer.from(authTag, "base64");

    //* Create the decipher using AES-256-GCM
    const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuffer, ivBuffer);

    //* Set the authentication tag before finalizing decryption
    decipher.setAuthTag(authTagBuffer);

    //* Perform decryption
    let decrypted = decipher.update(encryptedText, "base64", "utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;
  } catch(error) {
    console.log("Decryption failed: ", error);
    throw new Error("Failed to decrypt data. Possible tampering or incorrect key.");
  }
}