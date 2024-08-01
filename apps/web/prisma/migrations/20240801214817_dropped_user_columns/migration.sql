/*
  Warnings:

  - You are about to drop the column `emailIsVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `identityIsVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `middleName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `paymentIsActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneIsVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `plaidIdentityVerificationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailIsVerified",
DROP COLUMN "firstName",
DROP COLUMN "identityIsVerified",
DROP COLUMN "lastName",
DROP COLUMN "middleName",
DROP COLUMN "paymentIsActive",
DROP COLUMN "phoneIsVerified",
DROP COLUMN "plaidIdentityVerificationId",
DROP COLUMN "status",
DROP COLUMN "stripeSubscriptionId";
