-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "bot";

-- CreateTable
CREATE TABLE "bot"."BotCache" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "BotCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild"."Configs" (
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Configs_pkey" PRIMARY KEY ("guildId")
);

-- CreateIndex
CREATE UNIQUE INDEX "BotCache_id_key" ON "bot"."BotCache"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Configs_guildId_key" ON "guild"."Configs"("guildId");

-- AddForeignKey
ALTER TABLE "guild"."Configs" ADD CONSTRAINT "Configs_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guild"."Guild"("guildId") ON DELETE CASCADE ON UPDATE CASCADE;
