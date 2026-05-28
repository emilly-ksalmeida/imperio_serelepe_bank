import ProductsStockRepository from "../../repositories/productsStock.repository";

/*
processar a compra

--- dar baixa no estoque de cada produto -ok
--- pegar a lista de compra e separar por vendedor. -ok
--- faturar cada item/transferir dinheiro para o vendedor
--- registrar na tabela order
--- registrar na tabela order-items

processo finalizado
*/
export class RegisterOrderService {
  constructor(productsStockRepository = new ProductsStockRepository()) {
    this.productsStockRepository = productsStockRepository;
  }

  async execute(order) {
    /*
      order é um array de :
    {
      success: true,
      code: "PRODUCT_AVAILABLE",
      message: "Produto disponível em estoque",
      details: {
        id: product.id,
        name: product.name,
        quantity: productData.quantity,
        availableQuantity: product.stockQuantity,
        unitPriceOrdered:productData.unitPriceOrdered,
        sellerId: product.sellerId,
      },
    }
    */
    // dar baixa no estoque

    for (let item of order) {
      return await this.productsStockRepository.updateQuantityById(
        item.details.id,
        item.details.quantity,
      );
    }
    /**
    ----> separar o valor total dos items comprados por vendedor, o resultado disso vai ser usado para realizar o pagamento e registrar nas tabelas Order e Order_items

    ***
     const groupBySellerIds = new Map();

    for (const item of order) {
      const sellerId = item.details.sellerId;
    
      if (!groupBySellerIds.has(sellerId)) {
        groupBySellerIds.set(sellerId, []);
      }

      const currentValue = groupBySellerIds.get(sellerId);
      currentValue.push(item.details);
  
      groupBySellerIds.set(sellerID, currentValue);
    }

    ***
    */
   
   /*
   Estando com a lista separada groupBySellerIds

   function calculateOrderTotal(list) {
     let total = 0;
     list.forEach((item) => {
       const result = item.quantity * item.unitPriceOrdered;
       total = total + result;
     });  
     return total;
   }
ETAPA PARA O PAGAMENTO:
   for (let seller of groupBySellerIds){
     const list = seller[1];
   //   console.log(list);
   //   console.log(calculateOrderTotal(list));
     console.log(`O vendedor id: ${seller[0]}, vai receber ${calculateOrderTotal(list)}`);
   }
    */
  }
}
