import prisma from "./db.js";

export async function list() {
  const allUsers = await prisma.users.findMany();
  return allUsers;
}

export async function getBalanceById(accountId) {
  const userBalance = await prisma.accounts.findUnique({
    where: { id: accountId },
    select: { balance: true },
  });
  return userBalance;
}

export async function generateAccountStatement(userId) {
  const statement = await prisma.transfers.findMany({
    where: {
      OR: [{ fromId: userId }, { toId: userId }],
    },
    orderBy: [{ createdAt: "desc" }],
  });
  return statement;
}

export async function addDetailsTransfer(toAccountId){
  const details = await prisma.accounts.findUnique({
    select: {
      owner: {
        select: {
          name: true,
          username: true
        }
      }
    },
    where: { id: toAccountId}
  })
  return details;
}
