-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('BAIXA', 'ALTA', 'NORMAL');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Aprovado', 'Reprovado', 'Não será removido', 'Duplicado', 'Não é erro', 'Resolvido');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MASTER', 'TESTER', 'DEVELOPER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" SERIAL NOT NULL,
    "version" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
