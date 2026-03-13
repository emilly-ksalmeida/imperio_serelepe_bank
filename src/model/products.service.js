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
      }
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
    const { sellerId, name, description, unitPrice, stockQuantity, imgUrl } = productData;
    const parsedUnitPrice = parseFloat(unitPrice);
    const parsedStockQuantity = parseInt(stockQuantity, 10);

    return await this.repository.products.create({
      data: {
        sellerId,
        name,
        description,
        unitPrice: parsedUnitPrice,
        stockQuantity: parsedStockQuantity,
        imgUrl,
      },
    });
  }
}

export default ProductsService;
