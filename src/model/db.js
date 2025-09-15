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

export function transferir(contaOrigem, contaDestino, valor) {
  return prisma.$transaction(async (tx) => {
    const origem = await tx.usuarios.findUnique({
        where: {id: contaOrigem}
    });
    const saldoOrigem = Number(origem.saldo);
    const operacao = saldoOrigem - valor;

    if (operacao < 0) {
      throw new Error(`${origem.nome} não existe saldo suficiente para mandar o valor $${valor}`);
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
    const totalFinal = saldoDestino + valor;
  
    const recebedor = await tx.usuarios.update({
      data: {
        saldo: totalFinal
      },
      where: {id: contaDestino}
    });
    const registrarTransferencia = await tx.transacao.create({
    data:{
      valor: valor,
      origemId: contaOrigem,
      destinoId: contaDestino
    }
    });
    console.log(registrarTransferencia);
    return "Transferência realizada com sucesso!";
  })
}
