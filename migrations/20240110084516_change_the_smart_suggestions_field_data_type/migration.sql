/*
  Warnings:

  - The `smartSuggestions` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "smartSuggestions",
ADD COLUMN     "smartSuggestions" JSONB NOT NULL DEFAULT '{ "suggestions": [""], "suggestions_type": ""}';
