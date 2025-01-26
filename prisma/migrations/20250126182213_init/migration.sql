/*
  Warnings:

  - You are about to drop the column `passwordHashed` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordHashed",
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "hashedPassword" TEXT,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "providerId" TEXT;
