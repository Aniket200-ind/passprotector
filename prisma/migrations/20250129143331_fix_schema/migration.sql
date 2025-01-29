/*
  Warnings:

  - You are about to alter the column `refresh_token` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `access_token` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `id_token` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - The primary key for the `Password` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `encryptedPassword` on the `Password` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(512)`.
  - The `category` column on the `Password` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `strength` column on the `Password` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(320)`.
  - The primary key for the `VerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `VerificationToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PasswordStrength" AS ENUM ('weak', 'medium', 'strong');

-- CreateEnum
CREATE TYPE "PasswordCategory" AS ENUM ('personal', 'work', 'finance');

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "refresh_token" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "access_token" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "id_token" SET DATA TYPE VARCHAR(1024);

-- AlterTable
ALTER TABLE "Password" DROP CONSTRAINT "Password_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "encryptedPassword" SET DATA TYPE VARCHAR(512),
DROP COLUMN "category",
ADD COLUMN     "category" "PasswordCategory",
DROP COLUMN "strength",
ADD COLUMN     "strength" "PasswordStrength",
ADD CONSTRAINT "Password_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Password_id_seq";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE VARCHAR(320);

-- AlterTable
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
