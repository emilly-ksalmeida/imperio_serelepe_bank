import { ConfirmOrderService } from "./confirmOrder.service.js";
import { RegisterOrderService } from "./registerOrder.service.js";
import { PurchaseConfirmationError } from "../../errors/purchase/purchaseConfirmationError.error.js";

export default class FinalizePurchaseService {
  constructor(confirmOrderService = new ConfirmOrderService(), registerOrderService = new RegisterOrderService()) {
    this.confirmOrderService = confirmOrderService;
    this.registerOrderService = registerOrderService;
  }

  async execute(payload) {
    const validatedOrder = await this.confirmOrderService.execute(payload);

    if (!validatedOrder.success) {
      throw new PurchaseConfirmationError(validatedOrder);
    }

    const createdPurchase = await this.registerOrderService.execute(validatedOrder.details, payload.password, payload.userAccountId);

    return createdPurchase;

  }
}
