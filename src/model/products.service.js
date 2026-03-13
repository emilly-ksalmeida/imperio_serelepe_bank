import { prisma } from "./db.js";

export class ProductsService {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async getAllProducts() {
    return await this.repository.products.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        unitPrice: true,
      },
    });
  }

  async getProductsBySeller(sellerId) {
    return await this.repository.products.findMany({
      where: { sellerId: sellerId },
      select: {
        id: true,
        name: true,
        unitPrice: true,
        stockQuantity: true,
      },
    });
  }

  async newProduct(productData) {
    const { sellerId, name, description, unitPrice, stockQuantity, imgUrl } =
      productData;

    return await this.repository.products.create({
      data: {
        sellerId,
        name,
        description,
        unitPrice,
        stockQuantity,
        imgUrl,
      },
    });
  }

  async updateProduct(productId, currentUserId, updateData) {
    const { name, description, unitPrice, stockQuantity } = updateData;
    const isActive = stockQuantity > 0 ? true : false;
    const productIdParsed = parseInt(productId);

    return await this.repository.products.update({
      where: { id: productIdParsed, sellerId: currentUserId },
      data: {
        name,
        description,
        unitPrice,
        stockQuantity,
        isActive,
      },
    });
  }
}

export default ProductsService;
