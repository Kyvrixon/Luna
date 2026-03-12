-- AlterTable
ALTER TABLE "guild"."Configs" ADD COLUMN     "starboard_channelId" TEXT,
ADD COLUMN     "starboard_emoji" TEXT NOT NULL DEFAULT '⭐';
