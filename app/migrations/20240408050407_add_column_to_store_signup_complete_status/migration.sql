-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSignUpComplete" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "hasAcceptedTos" SET DEFAULT false,
ALTER COLUMN "hasSubscribedToMarketingEmails" SET DEFAULT false;
