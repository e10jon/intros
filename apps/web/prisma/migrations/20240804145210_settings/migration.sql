-- CreateEnum
CREATE TYPE "NotificationsFrequency" AS ENUM ('Instant', 'Daily', 'Weekly');

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "mobilePush" BOOLEAN,
    "notificationsFrequency" "NotificationsFrequency",
    "sendEmailsTime" TEXT,
    "dailyIntrosLimit" INTEGER,
    "dailyIntrosResetTime" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
