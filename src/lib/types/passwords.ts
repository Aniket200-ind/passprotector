// lib/types/passwords.ts
export type Password = {
    id: string;
    userId: string;
    siteName: string;
    encryptedPassword: string;
    category?: "personal" | "work" | "finance";
    strength?: "weak" | "medium" | "strong";
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type PasswordCreateRequest = {
    siteName: string;
    password: string; // Plaintext (will be encrypted in the API)
    category?: Password["category"];
  };