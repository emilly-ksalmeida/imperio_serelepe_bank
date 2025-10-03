-- DropForeignKey
ALTER TABLE "public"."Transacao" DROP CONSTRAINT "Transacao_origemId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Transacao" ADD CONSTRAINT "Transacao_origemId_fkey" FOREIGN KEY ("origemId") REFERENCES "public"."Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
