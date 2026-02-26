import Balance from "./balance.js";
import { prisma } from "./db.js";

export default class Transfer {
  constructor(data) {
    this.userAccountId = data.userAccountId;
    this.toAccountId = data.toAccountId;
    this.value = data.value;
    this.verifyBalance = new Balance(data);
  }

  preventSelfTransfer() {
    if (this.userAccountId === this.toAccountId) {
      throw new Error("Não é possível realizar esta transferência.");
    } else {
      return true;
    }
  }

  async executeTransfer() {
    const remainingBalance = await this.verifyBalance.verifyBalanceForDebit(this.value);
   
    return prisma.$transaction(async (tx) => {

      const fromUpdate = await tx.accounts.update({
        data: {
          balance: remainingBalance,
        },
        where: { id: this.userAccountId },
      });

      const to = await tx.accounts.findUnique({
        where: { id: this.toAccountId },
        select: { balance: true },
      });

      if(!to) {
        throw new Error(`A conta de destino ${this.toAccountId} não existe!`);
      }

      const toNewBalance = parseFloat(to.balance) + parseFloat(this.value);

      const toUpdate = await tx.accounts.update({
        data: {
          balance: toNewBalance,
        },
        where: { id: this.toAccountId },
      });
      
      const registerTransfer = await tx.transfers.create({
        data: {
          value: this.value,
          fromId: this.userAccountId,
          toId: this.toAccountId,
        },
      });
      return registerTransfer;
    });
  }
}
