import { prisma, prismaImport } from "../model/db.js";
import { NotFoundError } from "../errors/products/notFoundError.error.js";

export class AdminRepository {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async findAllUsers() {
    try {
      return await this.repository.users.findMany({
        select: {
            name: true,
            username: true,
            createdAt: true,
            securityQuestion: true
        }
      })
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  #handleDatabaseError(error) {
    if (error instanceof prismaImport.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundError("A operação falhou, produto não encontrado.");
      } else if (error.code === "P2003") {
        throw new NotFoundError(
          "A operação falhou, recurso relacionado não encontrado.",
        );
      }
    }
    throw error;
  }
}
