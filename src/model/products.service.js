import { prisma } from "./db.js";

export class ProductsService {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async getAllProducts() {
    return await this.repository.products.findMany();
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
