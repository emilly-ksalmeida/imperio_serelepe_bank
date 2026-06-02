import FinalizePurchaseService from "../../services/purchase/finalize-purchase.service.js";

class OrdersController {
  constructor(finalizePurchaseService = new FinalizePurchaseService()) {
    this.finalizePurchaseService = finalizePurchaseService;
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

      res.status(201).json({ message: "Compra realizada com sucesso!", details: result });
    
  }
}
export default OrdersController;
