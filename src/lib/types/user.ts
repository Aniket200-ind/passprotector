// lib/types/user.ts

export type User = {
    id: string;
    name?: string;
    email: string;
    emailVerified?: Date | null;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type Account = {
    id: string;
    userId: string;
    provider: string; // "google", "github", etc.
    providerAccountId: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  };
  