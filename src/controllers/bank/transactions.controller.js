import { z } from "zod";
import { transferSchema } from "../../model/validateSchema.js";

import AccountService from "../../services/accounts/account.service.js";
import TransferService from "../../services/transfers/transfer.service.js";
import { BusinessError } from "../../errors/transfer/businessError.error.js";

class TransactionsController {
  constructor(accountService = new AccountService(), transferService = new TransferService()) {
    this.accountService = accountService;
    this.transferService = transferService;
  }

  async makeTransfer(req, res, _next) {
    const data = req.body;
    const validatedData = transferSchema.safeParse(data);
    if (!validatedData.success) {
      const pretty = z.prettifyError(validatedData.error);
      throw new BusinessError(pretty);
    }

    const authenticatedAccount = req.dataCurrentUser.userAccountId;

    const result = await this.transferService.execute(data, authenticatedAccount);

    res.status(201).json(result);
  }

  async getStatement(req, res, _next) {
    const accountId = req.dataCurrentUser.userAccountId.id;
    const result = await this.accountService.generateAccountStatement(accountId);
    res.status(200).json(result);
  }
}

export default TransactionsController;
