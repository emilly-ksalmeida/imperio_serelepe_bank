/*
  Warnings:

  - You are about to alter the column `name` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(70)`.
  - You are about to alter the column `username` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "public"."Users" ALTER COLUMN "name" SET DATA TYPE VARCHAR(70),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(20);
