import { prisma, prismaImport } from "../model/db.js";
import { NotFoundError } from "../errors/account/notFoundError.error.js";

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
    if (error instanceof prismaImport.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new NotFoundError("A operação falhou, conta não encontrada.");
    }
    throw error;
  }
}

export default TransferRepository;
