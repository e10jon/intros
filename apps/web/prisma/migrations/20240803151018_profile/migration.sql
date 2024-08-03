-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "country" TEXT,
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "province" TEXT,
ADD COLUMN     "responseRate" DOUBLE PRECISION;
