/*
  Warnings:

  - The `status` column on the `Orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('paid', 'delivered', 'cancelled');

-- AlterTable
ALTER TABLE "public"."Orders" DROP COLUMN "status",
ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'paid';
