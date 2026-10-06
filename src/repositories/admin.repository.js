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

  async findAllSellers() {
    try {
      return await this.repository.users.findMany({
        where: { role: "seller" },
        select: {
          id: true,
          name: true,
          username: true,
        },
      });
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  async findSellerOrThrow(sellerId) {
    try {
      return await this.repository.users.findUniqueOrThrow({
        where: { id: sellerId, role: "seller" },
        select: { id: true },
      });
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  async findSellerByUsername(username) {
    try {
      return await this.repository.users.findUniqueOrThrow({
        where: { username, role: "seller" },
        select: { id: true },
      });
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  async updatePassword(username, passwordHash) {
    try {
      return await this.repository.users.update({
        data: {
          passwordHash: passwordHash,
          account: {
            update: {
              accountPasswordHash: passwordHash,
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
    }
    throw error;
  }
}
