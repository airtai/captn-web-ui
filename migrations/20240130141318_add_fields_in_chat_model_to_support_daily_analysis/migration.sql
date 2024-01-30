-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "agentChatHistory" TEXT,
ADD COLUMN     "chatType" TEXT,
ADD COLUMN     "emailContent" TEXT,
ADD COLUMN     "proposedUserAction" TEXT[] DEFAULT ARRAY[]::TEXT[];
