/*
  Warnings:

  - A unique constraint covering the columns `[hashedPassword]` on the table `Password` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedPassword` to the `Password` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Password" DROP CONSTRAINT "Password_user_id_fkey";

-- AlterTable
ALTER TABLE "Password" ADD COLUMN     "hashedPassword" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Password_hashedPassword_key" ON "Password"("hashedPassword");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
