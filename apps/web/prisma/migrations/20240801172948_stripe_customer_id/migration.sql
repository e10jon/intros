/*
  Warnings:

  - You are about to drop the column `stripePaymentIntentId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripePaymentIntentId",
ADD COLUMN     "stripeSubscriptionId" TEXT;
