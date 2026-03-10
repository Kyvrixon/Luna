-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "guild";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user";

-- CreateTable
CREATE TABLE "user"."Afk" (
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Afk_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "guild"."Guild" (
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "user"."User" (
    "userId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Afk_userId_key" ON "user"."Afk"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_guildId_key" ON "guild"."Guild"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "user"."User"("userId");

-- AddForeignKey
ALTER TABLE "user"."Afk" ADD CONSTRAINT "Afk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
