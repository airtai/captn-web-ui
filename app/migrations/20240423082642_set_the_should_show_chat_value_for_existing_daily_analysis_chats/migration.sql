-- This migration sets the shouldShowChat value to true for all existing daily analysis chats.
UPDATE "Chat" SET "shouldShowChat" = TRUE WHERE "chatType" = 'daily_analysis';
