/*
  Warnings:

  - The values [personal,work,finance] on the enum `PasswordCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PasswordCategory_new" AS ENUM ('Personal', 'Work', 'Finance');
ALTER TABLE "Password" ALTER COLUMN "category" TYPE "PasswordCategory_new" USING ("category"::text::"PasswordCategory_new");
ALTER TYPE "PasswordCategory" RENAME TO "PasswordCategory_old";
ALTER TYPE "PasswordCategory_new" RENAME TO "PasswordCategory";
DROP TYPE "PasswordCategory_old";
COMMIT;
