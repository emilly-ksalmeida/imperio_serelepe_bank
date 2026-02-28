import { z } from "zod";
import {
  transferSchema,
} from "../../model/validateSchema.js";

import {
  generateAccountStatement,
} from "../../model/listUsers.js";

import transfer from "../../model/transfers.js";

class TransactionsController {
  async makeTransfer(req, res) {
    try {
      const data = req.body;
      const validatedData = transferSchema.safeParse(data);
      if (!validatedData.success) {
        const pretty = z.prettifyError(validatedData.error);
        throw new Error(pretty);
      }
      const { userAccountId } = req.dataCurrentUser;
      const atualizedData = {
        userAccountId: userAccountId.id,
        ...data,
      };
      const result = await transfer(atualizedData);
      res.status(201).json(result);
    } catch (erro) {
      console.error(erro);
      res.status(422).json({ Erro: erro.message });
    }
  }

  async getStatement(req, res) {
    try {
      const accountId = req.dataCurrentUser.userAccountId.id;
      const result = await generateAccountStatement(accountId);
      res.status(200).json(result);
    } catch (erro) {
      console.error(erro.message);
      res.status(500).json({ Erro: erro.message });
    }
  }

}

export default TransactionsController