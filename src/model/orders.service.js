import { prisma } from "./db.js";

export default class OrdersService {
  constructor(purchaseData) {
    this.purchaseList = purchaseData.purchase;
    this.outOfStockItems = [];
  }

  async validateItemsStock(orderItem) {
    const product = await prisma.products.findUnique({
      where: { id: orderItem.idProduct },
      select: { stockQuantity: true },
    });

    if (orderItem.quantity > product.stockQuantity) {
      this.outOfStockItems.push({
        name: orderItem.name,
        availableStock: product.stockQuantity,
      });
    }
 
  }

  
}
