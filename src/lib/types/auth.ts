// lib/types/auth.ts

export type UserSession = {
    id: string;
    name?: string;
    email: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type AuthenticatedRequest = {
    user: UserSession;
  };
  