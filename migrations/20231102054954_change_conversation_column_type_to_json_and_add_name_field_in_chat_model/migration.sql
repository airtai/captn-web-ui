/*
  Warnings:

  - Changed the type of `conversation` on the `Conversation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "conversation",
ADD COLUMN     "conversation" JSONB NOT NULL;
