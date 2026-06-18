import { prisma, prismaImport } from "../model/db.js";
import { NotFoundError } from "../errors/products/notFoundError.error.js";

class OrdersAndOrderItemsRepository {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async createOrderWithItems(dataBase, buyerId, totalAmount, products) {
    try {
      return await dataBase.orders.create({
        data: {
          buyerId,
          totalAmount: new prismaImport.Decimal(totalAmount),
          orderItems: {
            create: products.map(p => ({
              productId: p.id,
              quantity: p.quantity,
              unitPriceOrdered: p.unitPriceOrdered,
              productNameOrdered: p.name
            }))
          }
        },
        select: {
          id: true,
          orderItems: {
            select: { id: true }
          }
        }
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
        throw new NotFoundError("A operação falhou, recurso relacionado não encontrado.");
      }
      
    }
    throw error;
  }
}

export default OrdersAndOrderItemsRepository;
