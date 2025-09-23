import bcryptjs from "bcryptjs";
import prisma from "./db.js";

export default function transfer(dados) {
  const {fromAccountId, toAccountId, value, password} = dados;
  
  return prisma.$transaction(async (tx) => {
    const from = await tx.account.findUnique({
        where: {id: fromAccountId}
    });

    const checkPassword = await bcryptjs.compare(password, from.accountPasswordHash);
    if(!checkPassword){
      throw new Error("Senha da conta incorreta!!");
    }

    const fromBalance = Number(from.balance);
    const operation = fromBalance - value;
    if (operation < 0) {
      throw new Error(`Não existe saldo suficiente para mandar o value $${value}`);
    }
    
    const fromUpdate= await tx.account.update({
      data: {
        balance: operation
      },
      where: {id: fromAccountId}
    });
    
    const to = await tx.account.findUnique({
        where: {id: toAccountId}
    });
    
    const toBalance = Number(to.balance);
    const total = toBalance + value;
  
    const toUpdate = await tx.account.update({
      data: {
        balance: total
      },
      where: {id: toAccountId}
    });
    const registerTransfer = await tx.transfers.create({
    data:{
      value: value,
      fromId: fromAccountId,
      toId: toAccountId
    }
    });
    
    return "Transferência realizada com sucesso!";
  })
}