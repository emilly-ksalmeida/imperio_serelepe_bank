import { UserOrdersRepository } from "../../repositories/userOrder.repository.js";

export class UserOrdersService {
  constructor(userOrderRepository = new UserOrdersRepository()) {
    this.userOrderRepository = userOrderRepository;
  }
  async list(userId, status) {
    return await this.userOrderRepository.findAllOrders(userId, status);
  }
}
