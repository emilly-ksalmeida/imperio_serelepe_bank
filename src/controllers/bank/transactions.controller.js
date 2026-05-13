import { z } from "zod";
import { transferSchema } from "../../model/validateSchema.js";

import AccountService from "../../services/accounts/account.service.js";
import TransferService from "../../services/transfers/transfer.service.js";

class TransactionsController {
  constructor(accountService = new AccountService(), transferService = new TransferService()) {
    this.accountService = accountService;
    this.transferService = transferService;
  }

  async makeTransfer(req, res) {
    try {
      const data = req.body;
      const validatedData = transferSchema.safeParse(data);
      if (!validatedData.success) {
        const pretty = z.prettifyError(validatedData.error);
        throw new Error(pretty);
      }
      
      const { userAccountId } = req.dataCurrentUser;
      
      const result = await this.transferService.execute(data, userAccountId);

      res.status(201).json(result);
    } catch (erro) {
      console.error(erro);
      res.status(422).json({ Erro: erro.message });
    }
  }

  async getStatement(req, res) {
    try {
      const accountId = req.dataCurrentUser.userAccountId.id;
      const result = await this.accountService.generateAccountStatement(accountId);
      res.status(200).json(result);
    } catch (erro) {
      console.error(erro.message);
      res.status(500).json({ Erro: erro.message });
    } 
  }
}

export default TransactionsController;
