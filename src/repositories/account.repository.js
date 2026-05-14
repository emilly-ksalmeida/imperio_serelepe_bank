import { prisma, prismaImport } from "../model/db.js";

class AccountRepository {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async findAccountById(dataBase, accountId) {
    try {
      return await dataBase.accounts.findUnique({
        where: { id: accountId },
      });
    } catch (error) {
      this.#handleDatabaseError(error);
    }
  }

  async findBalanceById(accountId) {
    try {
      return await this.repository.accounts.findUnique({
        where: { id: accountId },
        select: { balance: true },
      });
    } catch (error) {
      this.#handleDatabaseError(error);
    }
  }

  async updateBalance(dataBase, accountId, balance) {
    try {
      return await dataBase.accounts.update({
        where: { id: accountId },
        data: { balance },
      });
    } catch (error) {
      this.#handleDatabaseError(error);
    }
  }

  async accountStatement(userId) {
    try {
      const statements = await this.repository.transfers.findMany({
        take: 8,
        where: {
          OR: [{ fromId: userId }, { toId: userId }],
        },
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          value: true,
          createdAt: true,
          fromAccount: {
            select: {
              id: true,
              owner: {
                select: {
                  name: true,
                },
              },
            },
          },
          toAccount: {
            select: {
              id: true,
              owner: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      return statements;
    } catch (error) {
      if (error instanceof prismaImport.PrismaClientInitializationError) {
        throw new Error("Ocorreu um erro, tente novamente mais tarde", {
          cause: error,
        });
      }
      throw error;
    }
  }

  #handleDatabaseError(error) {
    if (error instanceof prismaImport.PrismaClientInitializationError) {
      throw new Error("Ocorreu um erro, tente novamente mais tarde.", {
        cause: error,
      });
    }
    throw error;
  }
}

export default AccountRepository;
