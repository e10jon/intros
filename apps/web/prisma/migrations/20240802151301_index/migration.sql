/*
  Warnings:

  - A unique constraint covering the columns `[fromUserId,toUserId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Conversation_fromUserId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_fromUserId_toUserId_key" ON "Conversation"("fromUserId", "toUserId");
