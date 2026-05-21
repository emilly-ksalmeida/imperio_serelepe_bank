import { prisma, prismaImport } from "../model/db.js";
import { NotFoundError } from "../errors/products/notFoundError.error.js";
import { ValidationError } from "../errors/products/validationError.error.js";

class ProductsRepository {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async findAllProducts() {
    try {
      return this.repository.products.findMany({
        where: { stockQuantity: { gt: 0 } },
        select: {
          id: true,
          name: true,
          description: true,
          unitPrice: true,
          imgUrl: true,
        },
      });
    } catch (error) {
      this.#handleDatabaseError(error);
    }
  }

  async findBySellerId(sellerId) {
    try {
      return this.repository.products.findMany({
        where: { sellerId },
        select: {
          id: true,
          name: true,
          description: true,
          unitPrice: true,
          stockQuantity: true,
          imgUrl: true,
        },
      });
    } catch (error) {
      this.#handleDatabaseError(error);
    }
  }

  async createProduct(sellerId, name, description, unitPrice, stockQuantity) {
    try {
      return this.repository.products.create({
        data: {
          sellerId,
          name,
          description,
          unitPrice,
          stockQuantity,
        },
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      this.#handleDatabaseError(error);
    }
  }

  async updateByIdAndSeller(productId, currentUserId, updateData) {
    try {
      return await this.repository.products.update({
        where: {
          id: productId,
          sellerId: currentUserId,
        },
        data: updateData,
        select: {
          id: true,
        },
      });
    } catch (error) {
      this.#handleDatabaseError(error);
    }
  }

  async deleteByIdAndSeller(productId, currentUserId) {
    try {
      return this.repository.products.delete({
        where: {
          id: productId,
          sellerId: currentUserId,
        },
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      this.#handleDatabaseError(error);
    }
  }

  #handleDatabaseError(error) {
    if (error instanceof prismaImport.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundError("A operação falhou, produto não encontrado.");
      }
      if (error.code === "P2002") {
        throw new ValidationError("Esse produto já existe", {
          cause: error,
        });
      }
    }
    throw error;
  }
}

export default ProductsRepository;
