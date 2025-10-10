import bcryptjs from "bcryptjs";
import prisma from "./db.js";

export default function transfer(data) {
  const { userAccountId, toAccountId, value, accountPassword } = data;
  if (userAccountId === toAccountId) {
    throw new Error("Não é possível realizar esta transferência.");
  }
  return prisma.$transaction(async (tx) => {
    const from = await tx.accounts.findUnique({
      where: { id: userAccountId },
    });

    const checkPassword = await bcryptjs.compare(
      accountPassword,
      from.accountPasswordHash
    );
    if (!checkPassword) {
      throw new Error("Senha da conta incorreta!!");
    }

    const subtraction = parseFloat(from.balance) - parseFloat(value);
    if (subtraction < 0) {
      throw new Error(
        `Não existe saldo suficiente para mandar o valor $${value}`
      );
    }

    const fromUpdate = await tx.accounts.update({
      data: {
        balance: subtraction,
      },
      where: { id: userAccountId },
    });

    const to = await tx.accounts.findUnique({
      where: { id: toAccountId },
    });

    const addition = parseFloat(to.balance) + parseFloat(value);
    const toUpdate = await tx.accounts.update({
      data: {
        balance: addition,
      },
      where: { id: toAccountId },
    });
    const registerTransfer = await tx.transfers.create({
      data: {
        value: value,
        fromId: userAccountId,
        toId: toAccountId,
      },
    });

    return registerTransfer;
  });
}
