-- AddForeignKey
ALTER TABLE "ConversationNotification" ADD CONSTRAINT "ConversationNotification_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
