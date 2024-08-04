/*
  Warnings:

  - Made the column `numNewIntrosRemaining` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "numNewIntrosRemaining" SET NOT NULL,
ALTER COLUMN "numNewIntrosRemaining" SET DEFAULT 1;
