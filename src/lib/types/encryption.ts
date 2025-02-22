//! lib/types/encryption.ts

export type EncryptedData = {
  encryptedText: string;
  iv: string; // Initialization Vector for AES-256
  authTag: string; // Authentication Tag for AES-256-GCM
};
