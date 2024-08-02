/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `reporterId` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strategy` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suspectId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportStrategy" AS ENUM ('Human', 'AI');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('Pending', 'Completed');

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "conversationId",
DROP COLUMN "userId",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reporterId" TEXT NOT NULL,
ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "strategy" "ReportStrategy" NOT NULL,
ADD COLUMN     "suspectId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Review";

-- DropEnum
DROP TYPE "ReviewStatus";

-- DropEnum
DROP TYPE "ReviewStrategy";

-- CreateIndex
CREATE INDEX "Conversation_fromUserId_idx" ON "Conversation"("fromUserId");

-- CreateIndex
CREATE INDEX "Conversation_toUserId_idx" ON "Conversation"("toUserId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "Profile_userId_idx" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");

-- CreateIndex
CREATE INDEX "Report_updatedAt_idx" ON "Report"("updatedAt");

-- CreateIndex
CREATE INDEX "Report_suspectId_idx" ON "Report"("suspectId");

-- CreateIndex
CREATE INDEX "Report_reporterId_idx" ON "Report"("reporterId");

-- CreateIndex
CREATE INDEX "Token_userId_idx" ON "Token"("userId");

-- CreateIndex
CREATE INDEX "Token_conversationId_idx" ON "Token"("conversationId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_suspectId_fkey" FOREIGN KEY ("suspectId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
