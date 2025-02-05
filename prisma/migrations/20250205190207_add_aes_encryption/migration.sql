/*
  Warnings:

  - Added the required column `iv` to the `Password` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Password" ADD COLUMN     "iv" VARCHAR(128) NOT NULL;
