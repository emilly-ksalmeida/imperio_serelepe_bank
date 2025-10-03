/*
  Warnings:

  - You are about to drop the column `idUsuario` on the `Conta` table. All the data in the column will be lost.
  - You are about to drop the column `saldo` on the `Conta` table. All the data in the column will be lost.
  - You are about to drop the column `senhaContaHash` on the `Conta` table. All the data in the column will be lost.
  - You are about to drop the column `destinoId` on the `Transacao` table. All the data in the column will be lost.
  - You are about to drop the column `origemId` on the `Transacao` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `Transacao` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `senhaHash` on the `Usuarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idUser]` on the table `Conta` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountPasswordHash` to the `Conta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUser` to the `Conta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromId` to the `Transacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toId` to the `Transacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Transacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Conta" DROP CONSTRAINT "Conta_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transacao" DROP CONSTRAINT "Transacao_origemId_fkey";

-- DropIndex
DROP INDEX "public"."Conta_idUsuario_key";

-- DropIndex
DROP INDEX "public"."Usuarios_email_key";

-- AlterTable
ALTER TABLE "public"."Conta" DROP COLUMN "idUsuario",
DROP COLUMN "saldo",
DROP COLUMN "senhaContaHash",
ADD COLUMN     "accountPasswordHash" TEXT NOT NULL,
ADD COLUMN     "balance" DECIMAL(20,2) NOT NULL DEFAULT 0,
ADD COLUMN     "idUser" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Transacao" DROP COLUMN "destinoId",
DROP COLUMN "origemId",
DROP COLUMN "valor",
ADD COLUMN     "fromId" TEXT NOT NULL,
ADD COLUMN     "toId" TEXT NOT NULL,
ADD COLUMN     "value" DECIMAL(20,2) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Usuarios" DROP COLUMN "email",
DROP COLUMN "nome",
DROP COLUMN "senhaHash",
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conta_idUser_key" ON "public"."Conta"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_username_key" ON "public"."Usuarios"("username");

-- AddForeignKey
ALTER TABLE "public"."Conta" ADD CONSTRAINT "Conta_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "public"."Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transacao" ADD CONSTRAINT "Transacao_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "public"."Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
