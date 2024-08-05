/*
  Warnings:

  - The values [Rejected] on the enum `MessageSpecialCode` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MessageSpecialCode_new" AS ENUM ('Muted', 'Unmuted', 'Reported');
ALTER TABLE "Message" ALTER COLUMN "specialCode" TYPE "MessageSpecialCode_new" USING ("specialCode"::text::"MessageSpecialCode_new");
ALTER TYPE "MessageSpecialCode" RENAME TO "MessageSpecialCode_old";
ALTER TYPE "MessageSpecialCode_new" RENAME TO "MessageSpecialCode";
DROP TYPE "MessageSpecialCode_old";
COMMIT;
