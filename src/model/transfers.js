import Balance from "./balance.js";
import { prisma } from "./db.js";

export default function transfer(data) {
  const { userAccountId, toAccountId, value, accountPassword } = data;

  if (userAccountId === toAccountId) {
    throw new Error("Não é possível realizar esta transferência.");
  }

  // preventSelfTransfer() {
  //   if (this.userAccountId === this.toAccountId) {
  //     throw new Error("Não é possível realizar esta transferência.");
  //   } else {
  //     return true;
  //   }
  // }

//   async executeTransfer() {
//     const remainingBalance = await this.verifyBalance.verifyBalanceForDebit(this.value);
   
//     return prisma.$transaction(async (tx) => {

//     const _fromUpdate = await tx.accounts.update({
//       data: {
//         balance: subtraction,
//       },
//       where: { id: userAccountId },
//     });

//     const to = await tx.accounts.findUnique({
//       where: { id: toAccountId },
//     });

//     const addition = parseFloat(to.balance) + parseFloat(value);
//     const _toUpdate = await tx.accounts.update({
//       data: {
//         balance: addition,
//       },
//       where: { id: toAccountId },
//     });
//     const registerTransfer = await tx.transfers.create({
//       data: {
//         value: value,
//         fromId: userAccountId,
//         toId: toAccountId,
//       },
//     });

//     return registerTransfer;
//   });
// }
}
