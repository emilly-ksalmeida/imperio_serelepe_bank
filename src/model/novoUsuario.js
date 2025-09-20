import bcryptjs from "bcryptjs";
import prisma from "../model/db.js";

export default async function novoUsuario(dados) {
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