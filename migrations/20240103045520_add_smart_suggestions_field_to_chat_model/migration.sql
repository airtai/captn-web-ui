-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "smartSuggestions" TEXT[] DEFAULT ARRAY[]::TEXT[];
