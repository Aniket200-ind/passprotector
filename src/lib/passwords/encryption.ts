//! src/lib/passwords/encryption.ts

import crypto from "crypto";
import { EncryptedData } from "../types";
import dotenv from "dotenv";
dotenv.config();

//* Validate and prepare the key
const SECRET_KEY = process.env.AES_SECRET_KEY;
if (!SECRET_KEY) throw new Error("Missing AES_SECRET_KEY.");

let keyBuffer: Buffer;
try {
  keyBuffer = Buffer.from(SECRET_KEY, "hex");
  if (keyBuffer.length !== 32) throw new Error();
} catch {
  throw new Error("AES_SECRET_KEY must be a 32-byte hex string.");
}

/**
 *? Encrypts a given plaintext using AES-256-GCM
 * @param plaintext - The data to be encrypted
 * @returns An object containing the encrypted data, IV, and the authentication tag.
 */
export const encryptAESGCM = (plaintext: string): EncryptedData => {
  const iv = crypto.randomBytes(12); //* 12-byte IV for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, iv);

  let encrypted = cipher.update(plaintext, "utf-8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag(); //* 16-byte tag

  return {
    encryptedText: encrypted,
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
};

/**
 *? Decrypts a given encrypted text using AES-256-GCM
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
  try {
    //* Convert base64-encoded IV and authTag back to Buffers
    const ivBuffer = Buffer.from(iv, "base64");
    const authTagBuffer = Buffer.from(authTag, "base64");

    if (ivBuffer.length !== 12) throw new Error("Invalid IV.");
    if (authTagBuffer.length !== 16) throw new Error("Invalid authTag.");

    //* Create the decipher using AES-256-GCM
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      keyBuffer,
      ivBuffer
    );
    decipher.setAuthTag(authTagBuffer);

    //* Perform decryption
    let decrypted = decipher.update(encryptedText, "base64", "utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed. Invalid key or tampered data.");
  }
};
