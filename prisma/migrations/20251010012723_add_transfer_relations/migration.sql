-- CreateIndex
CREATE INDEX "Transfers_fromId_idx" ON "public"."Transfers"("fromId");

-- CreateIndex
CREATE INDEX "Transfers_toId_idx" ON "public"."Transfers"("toId");

-- AddForeignKey
ALTER TABLE "public"."Transfers" ADD CONSTRAINT "Transfers_toId_fkey" FOREIGN KEY ("toId") REFERENCES "public"."Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
