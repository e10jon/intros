/*
  Warnings:

  - You are about to drop the column `rejectedAt` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedByUserId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `rejectionReason` on the `Conversation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_rejectedByUserId_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "rejectedAt",
DROP COLUMN "rejectedByUserId",
DROP COLUMN "rejectionReason",
ADD COLUMN     "mutedAt" TIMESTAMP(3),
ADD COLUMN     "reportedAt" TIMESTAMP(3);
