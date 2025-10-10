/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teste` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `securityAnswer` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `securityQuestion` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_idUser_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transfers" DROP CONSTRAINT "Transfers_fromId_fkey";

-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "securityAnswer" TEXT NOT NULL,
ADD COLUMN     "securityQuestion" VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE "public"."Account";

-- DropTable
DROP TABLE "public"."Teste";

-- CreateTable
CREATE TABLE "public"."Accounts" (
    "id" TEXT NOT NULL,
    "balance" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "accountPasswordHash" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_idUser_key" ON "public"."Accounts"("idUser");

-- AddForeignKey
ALTER TABLE "public"."Accounts" ADD CONSTRAINT "Account_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transfers" ADD CONSTRAINT "Transfers_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "public"."Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
