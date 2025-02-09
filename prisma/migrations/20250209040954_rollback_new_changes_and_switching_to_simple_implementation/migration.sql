/*
  Warnings:

  - You are about to drop the column `accessCount` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `failedAttempts` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `lastAccessedAt` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `lockUntil` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `lastActivity` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Password" DROP COLUMN "accessCount",
DROP COLUMN "failedAttempts",
DROP COLUMN "lastAccessedAt",
DROP COLUMN "lockUntil";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "ipAddress",
DROP COLUMN "lastActivity",
DROP COLUMN "userAgent";
