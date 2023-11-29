/*
  Warnings:

  - You are about to drop the column `conversation` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Conversation` table. All the data in the column will be lost.
  - Added the required column `message` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "conversation",
DROP COLUMN "status",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "previousConversationId" INTEGER,
ADD COLUMN     "replyToConversationId" INTEGER,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "team_id" INTEGER,
ADD COLUMN     "team_name" TEXT,
ADD COLUMN     "team_status" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_replyToConversationId_fkey" FOREIGN KEY ("replyToConversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_previousConversationId_fkey" FOREIGN KEY ("previousConversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
