import TransferRepository from "../../repositories/transfer.repository.js";

class TransferService {
  constructor(transferRepository = new TransferRepository()) {
    this.transferRepository = transferRepository;
  }

 async execute(data, userId) {
    try {
      const { toAccountId, value, accountPassword } = data;
      const userAccountId = userId.id;

      if (userAccountId === toAccountId) {
        throw new Error("Não é possível realizar esta transferência.");
      }

      const transferResult = await this.transferRepository.transfer(
        userAccountId,
        toAccountId,
        value,
        accountPassword,
      );
      return transferResult;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default TransferService;
