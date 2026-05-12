import AccountRepository from "../../repositories/account.repository";

class AccountService {
  constructor(accountRepository = new AccountRepository()) {
    this.accountRepository = accountRepository;
  }

  async getBalanceById(accountId) {
    const userBalance = await this.accountRepository.balanceById(accountId);
    return userBalance;
  }

  async generateAccountStatement(userId) {
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
  }
}

export default AccountService;
