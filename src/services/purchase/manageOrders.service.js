import { ManageOrdersRepository } from "../../repositories/manageOrders.repository.js";

export class ManageOrdersService {
  constructor(manageOrdersRepository = new ManageOrdersRepository()) {
    this.manageOrdersRepository = manageOrdersRepository;
  }
  async list(userId, status) {
    return await this.manageOrdersRepository.findAllOrders(userId, status);
  }

   async getOrderById(orderId) {
    return await this.manageOrdersRepository.getOrderById(orderId);
  }

  async markAsDelivered(orderId){
    return await this.manageOrdersRepository.markAsDelivered(orderId);
  }

   async markAsCancelled(orderId){
    return await this.manageOrdersRepository.markAsCancelled(orderId);
  }

  
}
