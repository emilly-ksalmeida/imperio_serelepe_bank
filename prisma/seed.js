import bcryptjs from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const DEFAULT_PASSWORD = await bcryptjs.hash("1234", 10);
  const DEFAULT_ACCOUNT_PASSWORD = await bcryptjs.hash("1234", 10);
  const DEFAULT_SECURITY_QUESTION = "abcde";
  const DEFAULT_SECURITY_ANSWER = await bcryptjs.hash("abcde", 10);

  const USERS = [
    {
      name: "admin",
      username: "admin",
      passwordHash: DEFAULT_PASSWORD,
      securityQuestion: DEFAULT_SECURITY_QUESTION,
      securityAnswer: DEFAULT_SECURITY_ANSWER,
      role: "admin"
    },
    {
      name: "user",
      username: "user1",
      passwordHash: DEFAULT_PASSWORD,
      securityQuestion: DEFAULT_SECURITY_QUESTION,
      securityAnswer: DEFAULT_SECURITY_ANSWER,
      role: "user"
    },
    {
      name: "user",
      username: "user2",
      passwordHash: DEFAULT_PASSWORD,
      securityQuestion: DEFAULT_SECURITY_QUESTION,
      securityAnswer: DEFAULT_SECURITY_ANSWER,
      role: "user"
    },
    {
      name: "seller",
      username: "seller1",
      passwordHash: DEFAULT_PASSWORD,
      securityQuestion: DEFAULT_SECURITY_QUESTION,
      securityAnswer: DEFAULT_SECURITY_ANSWER,
      role: "seller"
    }
  ];

  const PRODUCTS = [
    {
      name: "Produto 1",
      description: "Descrição do Produto 1",
      unitPrice: 10.99,
      stockQuantity: 100
    },
    {
      name: "Produto 2",
      description: "Descrição do Produto 2",
      unitPrice: 19.99,
      stockQuantity: 50
    },
    {
      name: "Produto 3",
      description: "Descrição do Produto 3",
      unitPrice: 5.99,
      stockQuantity: 200
    }
  ];

  USERS.forEach(async (user) => {

    const newUser = await prisma.users.upsert({
      where: { username: user.username },
      update: {},
      create: {
        name: user.name,
          username: user.username,
          passwordHash: user.passwordHash,
          securityQuestion: user.securityQuestion,
          securityAnswer: user.securityAnswer,
          role: user.role,
          account: {
            create: {
              accountPasswordHash: DEFAULT_ACCOUNT_PASSWORD,
              balance: 1000
            }
          },
          product: user.role === "seller" ? {
            createMany: {
              data: PRODUCTS.map((product) => ({
                name: product.name,
                description: product.description,
                unitPrice: product.unitPrice,
                stockQuantity: product.stockQuantity
              }))
            }
          } : undefined 
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