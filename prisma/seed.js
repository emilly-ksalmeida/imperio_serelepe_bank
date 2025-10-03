import bcryptjs from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const DEFAULT_PASSWORD = await bcryptjs.hash("123456", 10);
  const DEFAULT_ACCOUNT_PASSWORD = await bcryptjs.hash("1234", 10);

  const USERS = [
    {
      name: "admin",
      username: "admin",
      passwordHash: DEFAULT_PASSWORD
    },
    {
      name: "user",
      username: "user",
      passwordHash: DEFAULT_PASSWORD
    }
  ]

  USERS.forEach(async (user) => {
    const newUser = await prisma.users.create({
      data: {
        name: user.name,
        username: user.username,
        passwordHash: user.passwordHash
      }
    })

    await prisma.account.create({
      data: {
        idUser: newUser.id,
        accountPasswordHash: DEFAULT_ACCOUNT_PASSWORD,
        balance: 1000
      }
    })
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })