-- AlterTable
ALTER TABLE "Password" ADD COLUMN     "accessCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "failedAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastAccessedAt" TIMESTAMP(3),
ADD COLUMN     "lockUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "ipAddress" VARCHAR(45),
ADD COLUMN     "lastActivity" TIMESTAMP(3),
ADD COLUMN     "userAgent" VARCHAR(512);
