import ProductsStockValidatorService from "../products/productsStockValidator.service";
import { prisma } from "../../model/db.js";
import checkPassword from "../../utils/check-password.js";
import AccountService from "../accounts/account.service.js";
import { BusinessError } from "../../errors/transfer/businessError.error.js";
/*
-> confirmação da possibilidade de efetuar a compra --> ConfirmOrderService
        verificar  senha - ok
        verificar estoque de todos os produtos da lista - ok
        calcular total da compra - ok
        verificar saldo do usuário - ok
*/
export class ConfirmOrderService {
  constructor(
    productsStockValidatorService = new ProductsStockValidatorService(),
    accountService = new AccountService(),
    repository = prisma,
  ) {
    this.productsStockValidatorService = productsStockValidatorService;
    this.accountService = accountService;
    this.repository = repository;
  }

  async execute(payload) {
    const hash = await this.#findPasswordHash(payload.userId);
    const verifyPassword = await checkPassword(
      payload.password,
      hash.passwordHash,
    );

    if (!verifyPassword) {
      throw new Error("Senha da conta incorreta");
    }

    const verifyProducts = await this.productsStockValidatorService.execute(
      payload.purchase,
    );

    if (!verifyProducts[0].success) return { success: false, details: verifyProducts };

    const orderTotal = this.#calculateOrderTotal(payload.purchase);

    const currentBalance = await this.accountService.getBalanceById(
      payload.userAccountId,
    );

    if (currentBalance < orderTotal)
      throw new BusinessError(
        `Não existe saldo suficiente para efetuar uma compra no valor de $e ${orderTotal}`,
      );

    return { status: true, details: verifyProducts };
  }

  async #findPasswordHash(id) {
    return await this.repository.users.findUnique({
      where: {
        id: id,
      },
      select: {
        passwordHash: true,
      },
    });
  }

  #calculateOrderTotal(list) {
    let total = 0;
    list.forEach((item) => {
      const result = item.quantity * item.unitPriceOrdered;
      total = total + result;
    });
    return total;
  }
}
