-- CreateEnum
CREATE TYPE "MessageSpecialCode" AS ENUM ('Muted', 'Unmuted', 'Reported', 'Rejected');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "specialCode" "MessageSpecialCode";
