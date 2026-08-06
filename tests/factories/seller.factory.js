import { randomInt } from "node:crypto";
import { faker } from "@faker-js/faker";
import bcryptjs from "bcryptjs";

export async function createUserSeller(prisma, overrides = {}) {
  const { productData, ...userOverrides } = overrides;

  const defaultData = {
    name: faker.person.fullName(),
    username: `seller${randomInt(100000, 999999)}`,
    passwordHash: await bcryptjs.hash("1234", 10),
    securityQuestion: "abcde",
    securityAnswer: await bcryptjs.hash("abcde", 10),
    role: "seller",
    account: {
      create: {
        accountPasswordHash: await bcryptjs.hash("1234", 10),
      },
    },
  };

  if (productData) {
    const products = Array.isArray(productData) ? productData : [productData];
    defaultData.product = { create: products };
  }

  return await prisma.users.create({
    data: { ...defaultData, ...userOverrides },
    include: { account: true, product: true },
  });
}

export async function createProducts (prisma, productData) {
  return await prisma.products.create({
    data: productData
  });
}
