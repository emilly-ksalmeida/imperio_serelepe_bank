import {
  getBalanceById,
} from "../model/listUsers.js";

class AccountBalanceController {
  async getBalance(req, res) {
    try {
      const accountId = req.dataCurrentUser.userAccountId.id;
      const result = await getBalanceById(accountId);
      res.status(200).json(result);
    } catch (erro) {
      console.error(erro.message);
      res.status(500).json({ Erro: erro.message });
    }
  }
}

export default AccountBalanceController