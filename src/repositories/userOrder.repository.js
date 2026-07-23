import { NotFoundError } from "../errors/products/notFoundError.error.js";
import { prisma, prismaImport } from "../model/db.js";

export class UserOrdersRepository {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async findAllOrders(userId, status) {
    try {
      return await this.repository.orders.findMany({
        where: { buyerId: userId, status},
        select: {
          id: true,
          status: true,
          totalAmount: true,
          orderItems: true,
        },
      });
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
