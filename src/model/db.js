import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function listarUsuarios() {
    const user = await prisma.usuarios.findMany();
    return user;
}

export function criarUsuario(dados) {
  const {nome, email, senhaHash, senhaContaHash} = dados;
  return prisma.$transaction(async (tx)=>{
    const novoUsuario = await tx.usuarios.create({
      data: {
        nome: nome,
        email: email,
        senhaHash: senhaHash
      }});
    const novaConta = await tx.conta.create({
      data: {
        senhaContaHash: senhaContaHash,
        idUsuario: novoUsuario.id
      }
    });
    return `Usuário ${nome} criado com sucesso (id ${novoUsuario.id}), seu número de conta é: ${novaConta.id}! `
  });
}

export function transferir(dados) {
  const {contaOrigem, contaDestino, valor} = dados;
  return prisma.$transaction(async (tx) => {
    const origem = await tx.conta.findUnique({
        where: {id: contaOrigem}
    });
    const saldoOrigem = Number(origem.saldo);
    const operacao = saldoOrigem - valor;

    if (operacao < 0) {
      throw new Error(`Não existe saldo suficiente para mandar o valor $${valor}`);
    }
    
    const origemAtualizacao= await tx.conta.update({
      data: {
        saldo: operacao
      },
      where: {id: contaOrigem}
    });

    const destino = await tx.conta.findUnique({
        where: {id: contaDestino}
    });
    const saldoDestino = Number(destino.saldo);
    const totalFinal = saldoDestino + valor;
  
    const recebedor = await tx.conta.update({
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
