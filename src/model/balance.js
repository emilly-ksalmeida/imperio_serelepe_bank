import { prisma } from "./db.js";

export default class Balance {
  constructor(data) {
    this.userAccountId = data.userAccountId;
  }

  async getBalanceById() {
    const userBalance = await prisma.accounts.findUnique({
      where: { id: this.userAccountId.id },
      select: { balance: true },
    });

    return userBalance;
  }

  async verifyBalanceForDebit(valueForDebit) {
    const from = await prisma.accounts.findUnique({
      where: { id: this.userAccountId },
      select: { balance: true },
    });
    const remainingBalance = parseFloat(from.balance) - parseFloat(valueForDebit);

    if (remainingBalance < 0) {
      throw new Error(
        `Não existe saldo suficiente para mandar o valor $${valueForDebit}`,
      );
    } else {
      return remainingBalance;
    }
  }
}
