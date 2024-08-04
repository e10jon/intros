/*
  Warnings:

  - The `sendEmailsTime` column on the `UserSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dailyIntrosResetTime` column on the `UserSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "sendEmailsTime",
ADD COLUMN     "sendEmailsTime" TIMESTAMP(3),
DROP COLUMN "dailyIntrosResetTime",
ADD COLUMN     "dailyIntrosResetTime" TIMESTAMP(3);
