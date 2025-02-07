// lib/types/error.ts

export type ApiError = {
  statusCode: number;
  message: string;
  details?: string;
};
