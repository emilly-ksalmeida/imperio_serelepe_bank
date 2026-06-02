import AccountRepository from "../../repositories/account.repository.js";
import TransferRepository from "../../repositories/transfer.repository.js";
import { BusinessError } from "../../errors/transfer/businessError.error.js";
import { NotFoundError } from "../../errors/account/notFoundError.error.js";

export class PurchaseTransferService {
  constructor(
    accountRepository = new AccountRepository(),
    transferRepository = new TransferRepository(),
  ) {
    this.accountRepository = accountRepository;
    this.transferRepository = transferRepository;
  }

  async execute(tx, fromAccountId, toAccountId, value) {
    const fromAccount = await this.accountRepository.findAccountById(
      tx,
      fromAccountId,
    );
    if (!fromAccount) {
      throw new NotFoundError("Conta de origem não encontrada.");
    }

    const newFromBalance =
      Number.parseFloat(fromAccount.balance) - Number.parseFloat(value);

    if (newFromBalance < 0) {
      throw new BusinessError(
        `Não existe saldo suficiente para enviar $e ${value}`,
      );
    }

    const toAccount = await this.accountRepository.findAccountById(
      tx,
      toAccountId,
    );

    if (!toAccount) {
      throw new NotFoundError("Conta de destino não encontrada.");
    }

    const newToBalance =
      Number.parseFloat(toAccount.balance) + Number.parseFloat(value);

    await this.accountRepository.updateBalance(
      tx,
      fromAccountId,
      newFromBalance,
    );
    await this.accountRepository.updateBalance(tx, toAccountId, newToBalance);

    return await this.transferRepository.createTransfer(tx, {
      fromId: fromAccountId,
      toId: toAccountId,
      value,
    });
  }
}
