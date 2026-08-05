import { NotFoundError } from "../errors/account/notFoundError.error.js";
import { prisma, prismaImport } from "../model/db.js";

export default class AuthRepository {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async getSecurityQuestion(username) {
    try {
      return await this.repository.users.findUniqueOrThrow({
        where: { username },
        select: { securityQuestion: true },
      });
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  async getSecurityAnswer(username) {
    try {
      return await this.repository.users.findUniqueOrThrow({
        where: { username },
        select: { securityAnswer: true },
      });
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  async resetPassword(username, newPasswordHash, newAccountPasswordHash) {
    try {
      return await this.repository.users.update({
        data: {
          passwordHash: newPasswordHash,
          account: {
            update: {
              accountPasswordHash: newAccountPasswordHash,
            },
          },
        },
        where: {
          username: username,
        },
        select: {
          name: true,
        },
      });
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  #handleDatabaseError(error) {
    if (error instanceof prismaImport.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundError("A operação falhou, usuário não encontrado.");
      }
      
      throw error;
    }

    throw error;
  }
}
