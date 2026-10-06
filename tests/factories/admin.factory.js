import { randomInt } from "node:crypto";
import { faker } from "@faker-js/faker";
import bcryptjs from "bcryptjs";

export async function createUserAdmin(prisma, overrides = {}) {
  const defaultData = {
    name: faker.person.fullName(),
    username: `admin${randomInt(100000, 999999)}`,
    passwordHash: await bcryptjs.hash("1234", 10),
    securityQuestion: "abcde",
    securityAnswer: await bcryptjs.hash("abcde", 10),
    role: "admin",
    account: {
      create: {
        accountPasswordHash: await bcryptjs.hash("1234", 10),
      },
    },
  };

  return await prisma.users.create({
    data: { ...defaultData, ...overrides },
    include: { account: true },
  });
}
