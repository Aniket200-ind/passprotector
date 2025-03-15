/*
  Warnings:

  - The values [Medium] on the enum `PasswordStrength` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PasswordStrength_new" AS ENUM ('VULNERABLE', 'Weak', 'Moderate', 'Strong');
ALTER TABLE "Password" ALTER COLUMN "strength" TYPE "PasswordStrength_new" USING ("strength"::text::"PasswordStrength_new");
ALTER TYPE "PasswordStrength" RENAME TO "PasswordStrength_old";
ALTER TYPE "PasswordStrength_new" RENAME TO "PasswordStrength";
DROP TYPE "PasswordStrength_old";
COMMIT;
