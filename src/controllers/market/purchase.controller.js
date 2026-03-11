import PurchaseService from "../../model/purchase.js";

class PurchaseController {
  async createPurchase(req, res) {
    try {
      const purchaseList = req.body;
      const { id, userAccountId } = req.dataCurrentUser;
      const atualizedData = {
        userId: id,
        userAccountId: userAccountId.id,
        ...purchaseList,
      };

      //verificar o estoque de cada produto de cada vendedor da lista de compras. Se todos os produtos tiverem estoque retornar true, se ao menos 1 produto não tiver estoque retornar false e informar quais produtos estão indisponíveis. (essa função pode ser feita no model, recebendo a purchaseList como parametro).
      const verificacao = new PurchaseService(atualizedData);
      await verificacao.validateItemsStock();

      if (verificacao.outOfStockItems.length > 0) {
        return res.status(422).json({
          message: "Alguns produtos estão indisponíveis no momento.",
          items: verificacao.outOfStockItems.map(item => ({
            name: item.name,
            availableStock: item.availableStock
          }))
        });
      } else {
        return res.status(201).json({ message: "compra realizada com sucesso" });
      }
      //se a verificação for bem sucedida, gerar a transferencia para pagamento (percorrer o array purchase extraido do body).

      //Baixa no estoque tabela products
      //Registrar Order
      //Registrar OrderItem
      //Fazer transferencia para pagamento
      // Responder compra feita com sucesso
    } catch (erro) {
      console.error(erro.message);
      res.status(500).json({ Erro: erro.message });
    }
  }
}

export default PurchaseController