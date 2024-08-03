/*
  Warnings:

  - You are about to drop the column `fromUserId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `toUserId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_toUserId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "fromUserId",
DROP COLUMN "toUserId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
