-- CreateEnum
CREATE TYPE "NotificationLabel" AS ENUM ('NewConversation', 'NewMessage');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "label" "NotificationLabel" NOT NULL,
    "data" JSONB NOT NULL,
    "seenAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_label_data_idx" ON "Notification"("userId", "label", "data");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
