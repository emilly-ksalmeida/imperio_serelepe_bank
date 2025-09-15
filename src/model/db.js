import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function listarUsuarios() {
    const user = await prisma.usuarios.findMany();
    return user;
}

export async function criarUsuario(dados) {
    const user = await prisma.usuarios.create({
        data: dados});
    return user;
}

//Teste de transação sem registro na tabela de Transacao
function transfer(contaOrigem, contaDestino, valor) {
  return prisma.$transaction(async (tx) => {
    const origem = await tx.usuarios.findUnique({
        where: {id: contaOrigem}
    });
    const saldoOrigem = Number(origem.saldo);
    const operacao = saldoOrigem - valor;

    if (operacao < 0) {
      throw new Error(`${contaOrigem} não existe saldo suficiente para mandar o valor ${valor}`);
    }
    
    const origemAtualizacao= await tx.usuarios.update({
      data: {
        saldo: operacao
      },
      where: {id: contaOrigem}
    });

    const destino = await tx.usuarios.findUnique({
        where: {id: contaDestino}
    });
    const saldoDestino = Number(destino.saldo);
    console.log(destino);
    const totalFinal = saldoDestino + valor;
  
    const recebedor = await tx.usuarios.update({
      data: {
        saldo: totalFinal
      },
      where: {id: contaDestino}
    });

    return recebedor;
  })
}

async function main(contaOrigem, contaDestino, valor) {
  const resultado = await transfer(contaOrigem, contaDestino, valor);
  console.log(resultado);
}

main("dc244c3c-7072-4c9e-a523-31cc9a26eaee", "4ba38285-cd7f-425a-8a77-cc679a523a1b", 10);
