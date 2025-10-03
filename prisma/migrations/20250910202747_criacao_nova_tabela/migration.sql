-- CreateTable
CREATE TABLE "public"."Usuarios" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "saldo" DECIMAL(20,2) NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);
