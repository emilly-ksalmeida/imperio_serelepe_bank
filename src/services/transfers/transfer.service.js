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
      // Dados
      const { toAccountId, value, accountPassword } = data;
      const fromAccountId = authenticatedAccount.id;
      // Teste de autotransferencia
      if (fromAccountId === toAccountId) {
        throw new Error("Não é possível realizar esta transferência.");
      }
      // Localizando a conta do usuário autenticado
      const fromAccount = await this.accountRepository.findAccountById(
        this.repository,
        fromAccountId,
      );
      if (!fromAccount) {
        throw new Error("Conta de origem não encontrada.");
      }
      // Validando a senha do usuario autenticado
      const passwordIsValid = await checkPassword(
        accountPassword,
        fromAccount.accountPasswordHash,
      );
      if (!passwordIsValid) {
        throw new Error("Senha da conta incorreta!!");
      }
      // Verificando a existência da conta de destino
      const toAccount = await this.accountRepository.findAccountById(
        this.repository,
        toAccountId,
      );
      if (!toAccount) {
        throw new Error("Conta de destino não encontrada.");
      }
      //  Cálculo do saldo das duas contas envolvidas
      const newFromBalance =
        Number.parseFloat(fromAccount.balance) - Number.parseFloat(value);
      if (newFromBalance < 0) {
        throw new Error(
          `Não existe saldo suficiente para mandar o valor $${value}`,
        );
      }

      const newToBalance =
        Number.parseFloat(toAccount.balance) + Number.parseFloat(value);

      // Criando a transferencia e atualizações de saldo
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
}

export default TransferService;
