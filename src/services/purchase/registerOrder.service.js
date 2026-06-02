import { InsufficientProductStockError } from "../../errors/products/insufficientProductStockError.error.js";
import ProductsStockRepository from "../../repositories/productsStock.repository.js";
import calculateOrderTotal from "../../utils/calculateOrderTotal.js";
import AccountService from "../accounts/account.service.js";
import TransferService from "../transfers/transfer.service.js";

/*
  order é um array de :
{
   success: true,
    code: 'PRODUCT_AVAILABLE',
    message: 'Produto disponível em estoque',
    details: {
      id: 49,
      name: 'Paçoca',
      quantity: 1,
      availableQuantity: 100,
      unitPriceOrdered: 500,
      sellerId: '235b4126-5868-414a-acb7-cd50f428cf99',
      sellerAccountId: product.seller.account.id,
    }
}
*/
export class RegisterOrderService {
  constructor(
    productsStockRepository = new ProductsStockRepository(),
    transferservice = new TransferService(),
    accountService = new AccountService(),
  ) {
    this.productsStockRepository = productsStockRepository;
    this.transferservice = transferservice;
    this.accountService = accountService;
  }

  async execute(order, userData) {
    // dar baixa no estoque
    const { userAccountId, password } = userData;

    for (let item of order) {
      const remainingStock =
        item.details.availableQuantity - item.details.quantity;

      if (remainingStock < 0) {
        throw new InsufficientProductStockError(
          "Este produto não está disponível na quantidade desejada",
        );
      }

      await this.productsStockRepository.updateQuantityById(
        item.details.id,
        remainingStock,
      );
    }
    // Etapa classificação dos itens por vendedor
    const groupBySellerIds = new Map();

    for (const item of order) {
      const sellerId = item.details.sellerId;

      if (!groupBySellerIds.has(sellerId)) {
        groupBySellerIds.set(sellerId, []);
      }

      const currentValue = groupBySellerIds.get(sellerId);
      currentValue.push(item.details);

      groupBySellerIds.set(sellerId, currentValue);
    }

    // Etapa de pagamento
    let pagamentos = [];

    for (let seller of groupBySellerIds) {
      const accountSellerId = seller[1].sellerAccountId;
      const orderItems = seller[1];
      const totalValue = calculateOrderTotal(orderItems);

      const pagamento = await this.transferservice.execute(
        {
          toAccountId: accountSellerId,
          value: totalValue,
          accountPassword: password,
        },
        userAccountId,
      );
      pagamentos.push(pagamento);
    }
    return { resultado: pagamentos };
  }
}
