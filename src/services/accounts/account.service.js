import AccountRepository from "../../repositories/account.repository.js";

class AccountService {
  constructor(accountRepository = new AccountRepository()) {
    this.accountRepository = accountRepository;
  }

  async getBalanceById(accountId) {
    return await this.accountRepository.findBalanceById(accountId);
  }

  async generateAccountStatement(userId) {
    try {
      const statements = await this.accountRepository.accountStatement(userId);

      return statements.map((statement) => {
        return {
          value: statement.value,
          createdAt: statement.createdAt,
          fromAccountName: statement.fromAccount.owner.name,
          toAccountName: statement.toAccount.owner.name,
          fromAccountId: statement.fromAccount.id,
          toAccountId: statement.toAccount.id,
          received: statement.toAccount.id === userId,
        };
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default AccountService;
