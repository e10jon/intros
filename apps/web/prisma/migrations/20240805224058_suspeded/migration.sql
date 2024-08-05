-- AlterTable
ALTER TABLE "User" ADD COLUMN     "suspendedUntil" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "User_suspendedUntil_idx" ON "User"("suspendedUntil");
