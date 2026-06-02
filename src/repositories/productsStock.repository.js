import { NotFoundError } from "../errors/account/notFoundError.error.js";
import { prisma, prismaImport } from "../model/db.js";

class ProductsStockRepository {
  constructor(repository = prisma) {
    this.repository = repository;
  }
  async findOneById(productId) {
    try {
      return this.repository.products.findUnique({
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
      this.#handleDatabaseError(error);
    }
  }

  async updateQuantityById(productId, updatedQuantity) {
    try {
      return this.repository.products.update({
        where: { id: productId },
        data: {
          stockQuantity: updatedQuantity,
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      this.#handleDatabaseError(error);
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
