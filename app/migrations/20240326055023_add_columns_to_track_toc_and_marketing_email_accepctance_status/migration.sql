-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasAcceptedTos" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "hasSubscribedToMarketingEmails" BOOLEAN NOT NULL DEFAULT true;
