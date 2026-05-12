import { prisma } from "../model/db";

class AccountRepository {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async balanceById(accountId) {
    return await this.repository.accounts.findUnique({
      where: { id: accountId },
      select: { balance: true },
    });
  }

  async accountStatement(userId){
    return this.repository.transfers.findMany({
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
        },
      },
    });
  }
}

export default AccountRepository;
