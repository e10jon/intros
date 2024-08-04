-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nextTokenReset" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "User_nextTokenReset_idx" ON "User"("nextTokenReset");
