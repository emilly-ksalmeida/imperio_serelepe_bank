import { NotFoundError } from "../errors/account/notFoundError.error.js";
import { prisma, prismaImport } from "../model/db.js";

class ProductsStockRepository {
  constructor(repository = prisma) {
    this.repository = repository;
  }
  async findOneById(productId) {
    try {
      return await this.repository.products.findUnique({
        where: { id: productId },
        select: {
          id: true,
          name: true,
          unitPrice: true,
          stockQuantity: true,
          sellerId: true,
          seller: {
            select: {
              account: {
                select: { id: true },
              },
            },
          },
        },
      });
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  async updateQuantityById(productId, quantity, updatedQuantity, tx) {
    try {
      const client = tx ?? this.repository;

      return await client.products.update({
        where: { id: productId, stockQuantity: { gte: quantity } },
        data: {
          stockQuantity: { decrement: quantity },
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  #handleDatabaseError(error) {
    if (
      error instanceof prismaImport.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError("A operação falhou, produto não encontrado.");
    }
    throw error;
  }
}

export default ProductsStockRepository;
