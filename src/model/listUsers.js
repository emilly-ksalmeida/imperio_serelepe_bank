import prisma from "./db.js";

export async function getBalanceById(accountId) {
  const userBalance = await prisma.accounts.findUnique({
    where: { id: accountId },
    select: { balance: true },
  });
  return userBalance;
}

export async function generateAccountStatement(userId) {
  const statements = await prisma.transfers.findMany({
    take: 8,
    where: {
      OR: [{ fromId: userId }, { toId: userId }],
    },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      value: true,
      createdAt: true,
      fromAccount: {
        select: {
          id: true,
          owner: {
            select: {
              name: true,
            },
          },
        },
      },
      toAccount: {
        select: {
          id: true,
          owner: {
            select: {
              name: true,
            },
          },
        },
      }
    }
  });


  return statements.map(statement => {
    return {
      value: statement.value,
      createdAt: statement.createdAt,
      fromAccountName: statement.fromAccount.owner.name,
      toAccountName: statement.toAccount.owner.name,
      fromAccountId: statement.fromAccount.id,
      toAccountId: statement.toAccount.id,
      received: statement.toAccount.id === userId
    }
  });
}
