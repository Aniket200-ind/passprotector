/*
  Warnings:

  - You are about to drop the column `encryptedPassword` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Password` table. All the data in the column will be lost.
  - Added the required column `authTag` to the `Password` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encrypted_password` to the `Password` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Password` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Password" DROP CONSTRAINT "Password_userId_fkey";

-- DropIndex
DROP INDEX "Password_userId_idx";

-- AlterTable
ALTER TABLE "Password" DROP COLUMN "encryptedPassword",
DROP COLUMN "userId",
ADD COLUMN     "authTag" TEXT NOT NULL,
ADD COLUMN     "encrypted_password" VARCHAR(512) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Password_user_id_idx" ON "Password"("user_id");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
