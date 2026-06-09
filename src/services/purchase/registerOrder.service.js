import { prisma } from "../../model/db.js";
import { InsufficientProductStockError } from "../../errors/products/insufficientProductStockError.error.js";
import ProductsStockRepository from "../../repositories/productsStock.repository.js";
import calculateOrderTotal from "../../utils/calculateOrderTotal.js";
import { PurchaseTransferService } from "./purchaseTransfer.service.js";

export class RegisterOrderService {
  constructor(
    productsStockRepository = new ProductsStockRepository(),
    purchaseTransferService = new PurchaseTransferService(),
  ) {
    this.productsStockRepository = productsStockRepository;
    this.purchaseTransferService = purchaseTransferService;
  }

  async execute(order, userData) {
    const { userAccountId } = userData;

    return await prisma.$transaction(async (tx) => {
      for (const item of order) {
        const remainingStock =
          item.details.availableQuantity - item.details.quantity;

        if (remainingStock < 0) {
          throw new InsufficientProductStockError(
            "Este produto não está disponível na quantidade desejada",
          );
        }

        await this.productsStockRepository.updateQuantityById(
          item.details.id,
          remainingStock,
          tx,
        );
      }

      const groupBySellerIds = new Map();

      for (const item of order) {
        const sellerId = item.details.sellerId;

        if (!groupBySellerIds.has(sellerId)) {
          groupBySellerIds.set(sellerId, []);
        }

        groupBySellerIds.get(sellerId).push(item.details);
      }

      const completedPayments = [];

      for (const seller of groupBySellerIds) {
        const orderItems = seller[1];
        const totalValue = calculateOrderTotal(orderItems);
        const accountSellerId = orderItems[0].sellerAccountId;

        const payment = await this.purchaseTransferService.execute(
          tx,
          userAccountId,
          accountSellerId,
          totalValue,
        );
        completedPayments.push(payment);
      }

      return { result: completedPayments };
    });
  }
}
