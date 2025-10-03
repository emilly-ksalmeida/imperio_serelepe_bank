-- CreateTable
CREATE TABLE "public"."Teste" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT,
    "idade" INTEGER NOT NULL,

    CONSTRAINT "Teste_pkey" PRIMARY KEY ("id")
);
