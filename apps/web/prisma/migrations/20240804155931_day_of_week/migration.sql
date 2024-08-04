-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "sendEmailsDayOfWeek" "DayOfWeek";
