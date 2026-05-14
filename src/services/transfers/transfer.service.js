import { prisma } from "../../model/db.js";
import TransferRepository from "../../repositories/transfer.repository.js";
import AccountRepository from "../../repositories/account.repository.js";
import checkPassword from "../../utils/check-password.js";

class TransferService {
  constructor(
    repository = prisma,
    accountRepository = new AccountRepository(),
    transferRepository = new TransferRepository(),
  ) {
    this.repository = repository;
    this.accountRepository = accountRepository;
    this.transferRepository = transferRepository;
  }

  async execute(data, authenticatedAccount) {
    try {
      const { toAccountId, value, accountPassword } = data;
      const fromAccountId = authenticatedAccount.id;

      if (fromAccountId === toAccountId) {
        throw new Error("Não é possível realizar esta transferência.");
      }

      const { fromAccount, toAccount } = await this.#validateAccounts(
        fromAccountId,
        toAccountId,
      );

      const passwordIsValid = await checkPassword(
        accountPassword,
        fromAccount.accountPasswordHash,
      );
      if (!passwordIsValid) {
        throw new Error("Senha da conta incorreta!!");
      }

      const { newFromBalance, newToBalance } = this.#calculateBalances(
        fromAccount,
        value,
        toAccount,
      );

      const transfer = await this.repository.$transaction(async (tx) => {
        await this.accountRepository.updateBalance(
          tx,
          fromAccountId,
          newFromBalance,
        );
        await this.accountRepository.updateBalance(
          tx,
          toAccountId,
          newToBalance,
        );
        return await this.transferRepository.createTransfer(tx, {
          fromId: fromAccountId,
          toId: toAccountId,
          value,
        });
      });

      return transfer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async #validateAccounts(fromAccountId, toAccountId) {
    const fromAccount = await this.accountRepository.findAccountById(
      this.repository,
      fromAccountId,
    );
    if (!fromAccount) {
      throw new Error("Conta de origem não encontrada.");
    }
    const toAccount = await this.accountRepository.findAccountById(
      this.repository,
      toAccountId,
    );
    if (!toAccount) {
      throw new Error("Conta de destino não encontrada.");
    }
    return {
      fromAccount,
      toAccount,
    };
  }

  #calculateBalances(fromAccount, value, toAccount) {
    const newFromBalance =
      Number.parseFloat(fromAccount.balance) - Number.parseFloat(value);

    if (newFromBalance < 0) {
      throw new Error(
        `Não existe saldo suficiente para mandar o valor $${value}`,
      );
    }

    const newToBalance =
      Number.parseFloat(toAccount.balance) + Number.parseFloat(value);

    return {
      newFromBalance,
      newToBalance,
    };
  }
}

export default TransferService;
