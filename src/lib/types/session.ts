// lib/types/session.ts

export type Session = {
    id: string;
    sessionToken: string;
    userId: string;
    expires: Date;
    createdAt: Date;
    updatedAt: Date;
  };
  