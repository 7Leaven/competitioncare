-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "scheduledAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastStreakNotified" INTEGER NOT NULL DEFAULT 0;
