import { PrismaClient } from "../generated/prisma/index.js";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export async function listarUsuarios() {
    const user = await prisma.usuarios.findMany();
    return user;
}

export async function criarUsuario(dados) {
  const {nome, email, senha, senhaConta} = dados;

  const senhaHash = await bcryptjs.hash(senha, 10);
  const senhaContaHash = await bcryptjs.hash(senhaConta, 10);

  return prisma.$transaction(async (tx)=>{
    const novoUsuario = await tx.usuarios.create({
      data: {
        nome,
        email,
        senhaHash
      }});
    const novaConta = await tx.conta.create({
      data: {
        senhaContaHash,
        idUsuario: novoUsuario.id
      }
    });
    return `Usuário ${nome} criado com sucesso (id ${novoUsuario.id}), seu número de conta é: ${novaConta.id}! `
  });
}

export function transferir(dados) {
  const {contaOrigem, contaDestino, valor, senha} = dados;
  return prisma.$transaction(async (tx) => {
    const origem = await tx.conta.findUnique({
        where: {id: contaOrigem}
    });

    const verificacaoSenha = await bcryptjs.compare(senha, origem.senhaContaHash);
    if(!verificacaoSenha){
      throw new Error("Senha da conta incorreta!!");
    }

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
    
    return "Transferência realizada com sucesso!";
  })
}
