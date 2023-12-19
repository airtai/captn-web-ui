/*
  Warnings:

  - You are about to drop the column `is_question_from_agent` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `team_name` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `team_status` on the `Conversation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "team_id" INTEGER,
ADD COLUMN     "team_name" TEXT,
ADD COLUMN     "team_status" TEXT;

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "is_question_from_agent",
DROP COLUMN "team_id",
DROP COLUMN "team_name",
DROP COLUMN "team_status";
