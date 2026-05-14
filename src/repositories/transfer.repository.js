import { prisma, prismaImport } from "../model/db.js";

class TransferRepository {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async createTransfer(dataBase, { fromId, toId, value }) {
    try {
      const newTransfer = await dataBase.transfers.create({
        data: {
          fromId,
          toId,
          value,
        },
      });
      return newTransfer;
    } catch (error) {
      this.#handleDatabaseError(error);
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

export default TransferRepository;
