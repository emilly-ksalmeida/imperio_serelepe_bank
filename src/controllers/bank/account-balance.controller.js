import AccountService from "../../services/accounts/account.service.js";

class AccountBalanceController {
  constructor(accountService = new AccountService()) {
    this.accountService = accountService;
  }
  async getBalance(req, res, _next) {
    const accountId = req.dataCurrentUser.userAccountId.id;
    const result = await this.accountService.getBalanceById(accountId);
    res.status(200).json(result);
  }
}

export default AccountBalanceController;
