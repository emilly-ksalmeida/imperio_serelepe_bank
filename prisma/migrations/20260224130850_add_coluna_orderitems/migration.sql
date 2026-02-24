/*
  Warnings:

  - Added the required column `productNameOrdered` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."OrderItems" ADD COLUMN     "productNameOrdered" VARCHAR(100) NOT NULL;
