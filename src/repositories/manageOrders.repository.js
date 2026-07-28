import { NotFoundError } from "../errors/products/notFoundError.error.js";
import { Status } from "../generated/prisma/index.js";
import { prisma, prismaImport } from "../model/db.js";

export class ManageOrdersRepository {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async findAllOrders(userId, status) {
    try {
      return await this.repository.orders.findMany({
        where: { buyerId: userId, status},
        select: {
          id: true,
          status: true,
          totalAmount: true,
          orderItems: {
            select: {
              id: true,
              productNameOrdered: true,
              unitPriceOrdered: true,
              quantity: true,
            }
          }
        },
      });
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  async getOrderById(orderId) {
     try {
      return await this.repository.orders.findUnique({
        where: { id: orderId, status: Status.paid },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          orderItems: {
            select: {
              id: true,
              productNameOrdered: true,
              unitPriceOrdered: true,
              quantity: true,
            }
          },
          buyer: {
            select: {
              name: true,
            }
          }
        },
      });
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  async markAsDelivered(orderId){
    try{
      return this.repository.orders.update({
        where: { id: orderId },
        data: {
          status: Status.delivered
        },
        select: {
          status: true
        }
      });
    } catch (error) {
      return this.#handleDatabaseError(error);
    }
  }

  async markAsCancelled(orderId){
    try{
      return this.repository.orders.update({
        where: { id: orderId },
        data: {
          status: Status.cancelled
        },
        select: {
          status: true
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
        throw new NotFoundError(
          "A operação falhou, recurso relacionado não encontrado.",
        );
      }
    }
    throw error;
  }
}
