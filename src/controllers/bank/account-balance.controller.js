import AccountService from "../../services/accounts/account.service";

class AccountBalanceController {
   constructor(accountService = new AccountService()) {
    this.accountService = accountService;
  }
  async getBalance(req, res) {
    try {
      const accountId = req.dataCurrentUser.userAccountId.id;
      const result = await this.accountService.getBalanceById(accountId);
      res.status(200).json(result);
    } catch (erro) {
      console.error(erro.message);
      res.status(500).json({ Erro: erro.message });
    }
  }
}

export default AccountBalanceController;