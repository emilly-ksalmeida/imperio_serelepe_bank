import FinalizePurchaseService from "../../services/purchase/finalize-purchase.service.js";
import { UserOrdersService } from "../../services/purchase/userOrders.service.js";

class OrdersController {
  constructor(
    finalizePurchaseService = new FinalizePurchaseService(),
    userOrderSevice = new UserOrdersService(),
  ) {
    this.finalizePurchaseService = finalizePurchaseService;
    this.userOrderSevice = userOrderSevice;
  }

  async finalizeOrder(req, res) {
    const purchaseData = req.body;
    const { id, userAccountId } = req.dataCurrentUser;
    const orderPayload = {
      userId: id,
      userAccountId: userAccountId.id,
      ...purchaseData,
    };
    const result = await this.finalizePurchaseService.execute(orderPayload);

    res
      .status(201)
      .json({ message: "Compra realizada com sucesso!", details: result });
  }

  async listOrder(req, res) {
    const { id } = req.dataCurrentUser;
    const { status } = req.query;

    const result = await this.userOrderSevice.list(id, status);

    res.status(200).json(result);
  }

  async getOrder(req, res) {
    const { orderId } = req.params;

    const result = await this.userOrderSevice.getOrderById(orderId);

    res.status(200).json(result);
  }
}

export default OrdersController;
