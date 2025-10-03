import prisma from "./db.js";

export async function list() {
  const allUsers = await prisma.users.findMany();
  return allUsers;
}

export async function getBalanceById(accountId) {
  const userBalance = await prisma.account.findUnique({
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
