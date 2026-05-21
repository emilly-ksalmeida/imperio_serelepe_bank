import FinalizePurchaseService from "../../services/purchase/finalize-purchase.service.js";

class OrdersController {
  constructor(finalizePurchaseService = new FinalizePurchaseService()) {
    this.finalizePurchaseService = finalizePurchaseService;
  }

  async finalizeOrder(req, res) {
    try {
      const purchaseData = req.body;
      const { id, userAccountId } = req.dataCurrentUser;
      const orderPayload = {
        userId: id,
        userAccountId: userAccountId.id,
        ...purchaseData,
      };
      await this.finalizePurchaseService.execute(orderPayload);

      res.status(201).json({ message: "Compra realizada com sucesso!" });
    } catch (erro) {
      res.status(500).json({ message: erro.message });
    }
  }
}
export default OrdersController;
