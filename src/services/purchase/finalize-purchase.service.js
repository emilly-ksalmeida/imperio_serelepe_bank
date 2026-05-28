import { ConfirmOrderService } from "./confirmOrder.service";
import { RegisterOrderService } from "./registerOrder.service";
import { PurchaseConfirmationError } from "../../errors/purchase/purchaseConfirmationError.error";

export class FinalizePurchaseService {
  constructor(confirmOrderService = new ConfirmOrderService(), registerOrderService = new RegisterOrderService()) {
    this.confirmOrderService = confirmOrderService;
    this.registerOrderService = registerOrderService;
  }

  async execute(payload) {
    // validatedOrder pode ter propriedade success com valor true ou false
    const validatedOrder = await this.confirmOrderService.execute(payload);

    if (!validatedOrder.success) {
      throw new PurchaseConfirmationError(validatedOrder);
    }

    const createdPurchase = await this.registerOrderService.execute(validatedOrder.details);

  }
}
