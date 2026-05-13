import { prisma, prismaImport } from "../model/db.js";
import checkPassword from "../utils/check-password.js";

class TransferRepository {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async transfer(userAccountId, toAccountId, value, accountPassword) {
    try {
      return this.repository.$transaction(async (tx) => {
        const from = await tx.accounts.findUnique({
          where: { id: userAccountId },
        });

        const validatePassword = await checkPassword(
          accountPassword,
          from.accountPasswordHash,
        );

        if (!validatePassword) {
          throw new Error("Senha da conta incorreta!!");
        }

        const subtraction = parseFloat(from.balance) - parseFloat(value);
        if (subtraction < 0) {
          throw new Error(
            `Não existe saldo suficiente para mandar o valor $${value}`,
          );
        }

        const _fromUpdate = await tx.accounts.update({
          data: {
            balance: subtraction,
          },
          where: { id: userAccountId },
        });

        const to = await tx.accounts.findUnique({
          where: { id: toAccountId },
        });

        const addition = parseFloat(to.balance) + parseFloat(value);
        const _toUpdate = await tx.accounts.update({
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
    } catch (error) {
      if (error instanceof prismaImport.PrismaClientInitializationError) {
        throw new Error("Ocorreu um erro, tente novamente mais tarde", {
          cause: error,
        });
      }
      throw error;
    }
  }
}

export default TransferRepository;
