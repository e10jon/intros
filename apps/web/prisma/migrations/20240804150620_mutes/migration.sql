/*
  Warnings:

  - You are about to drop the column `mobilePush` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `notificationsFrequency` on the `UserSettings` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EmailFrequency" AS ENUM ('Daily', 'Weekly', 'Monthly');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "mutedByUserId" TEXT;

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "mobilePush",
DROP COLUMN "notificationsFrequency",
ADD COLUMN     "emailFrequency" "EmailFrequency",
ADD COLUMN     "pushToken" TEXT;

-- DropEnum
DROP TYPE "NotificationsFrequency";

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_mutedByUserId_fkey" FOREIGN KEY ("mutedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
