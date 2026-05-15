import { DatabaseError } from "../errors/dataBaseError.error.js";
import { prisma, prismaImport } from "../model/db.js";

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
          // imgUrl: true,
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

  async createProduct(
    sellerId,
    name,
    description,
    unitPrice,
    stockQuantity
  ) {
    try {
      return this.repository.products.create({
        data: {
          sellerId,
          name,
          description,
          unitPrice,
          stockQuantity
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
    if (error instanceof prismaImport.PrismaClientInitializationError) {
      throw new DatabaseError("Ocorreu um erro, tente novamente mais tarde.", {
        cause: error,
      });
    }

    if (error instanceof prismaImport.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new DatabaseError("Uma operação falhou porque depende de um ou mais registros que eram necessários, mas não foram encontrados.", {
        cause: error,
      });
      }
      if (error.code === "P2002"){
        throw new DatabaseError("Falha na restrição de unicidade.", {
        cause: error,
      });
      }
      throw new DatabaseError("Ocorreu um erro!", {
        cause: error,
      });
    }
    throw error;
  }
}

export default ProductsRepository;
