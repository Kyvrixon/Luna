/*
  Warnings:

  - You are about to drop the `BotCache` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "bot"."BotCache";

-- CreateTable
CREATE TABLE "bot"."Bot" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bot_id_key" ON "bot"."Bot"("id");
