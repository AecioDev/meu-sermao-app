-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('missoes', 'ensino', 'adoracao', 'avivamento', 'santa_ceia', 'acao_de_gracas', 'juventude', 'familia', 'evangelismo', 'oracao');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('free', 'premium');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'free',
    "sermons_this_month" INTEGER NOT NULL DEFAULT 0,
    "last_reset_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sermon" (
    "id" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "theme" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "keyVerse" TEXT,
    "introduction" TEXT,
    "conclusion" TEXT,
    "notes" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Sermon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainPoint" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "scriptureReferences" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sermonId" TEXT NOT NULL,

    CONSTRAINT "MainPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Sermon_userId_idx" ON "Sermon"("userId");

-- CreateIndex
CREATE INDEX "MainPoint_sermonId_idx" ON "MainPoint"("sermonId");

-- AddForeignKey
ALTER TABLE "Sermon" ADD CONSTRAINT "Sermon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MainPoint" ADD CONSTRAINT "MainPoint_sermonId_fkey" FOREIGN KEY ("sermonId") REFERENCES "Sermon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
