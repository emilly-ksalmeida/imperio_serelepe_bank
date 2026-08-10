import { prisma } from "./setup/prisma.js";

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  const deleteOrderItems = prisma.orderItems.deleteMany();
  const deleteTransfers = prisma.transfers.deleteMany();
  const deleteOrders = prisma.orders.deleteMany();
  const deleteProducts = prisma.products.deleteMany();
  const deleteAccounts = prisma.accounts.deleteMany();
  const deleteUsers = prisma.users.deleteMany();

  await prisma.$transaction([
    deleteOrderItems,
    deleteTransfers,
    deleteOrders,
    deleteProducts,
    deleteAccounts,
    deleteUsers,
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
