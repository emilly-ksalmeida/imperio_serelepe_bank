import { faker } from "@faker-js/faker"
import bcryptjs from "bcryptjs"

export async function createUser(prisma, overrides = {}) {
  const defaultData = {
    name: faker.person.fullName(),
    username: `${faker.internet.username()}_${crypto.randomUUID()}`.slice(0, 15),
    passwordHash: await bcryptjs.hash("1234", 10),
    securityQuestion: "abcde",
    securityAnswer: await bcryptjs.hash("abcde", 10),
    role: "user"
  }

  return await prisma.users.create({
    data: { ...defaultData, ...overrides }
  })
}

export async function createUserWithAccount(prisma, overrides = {}) {
  const user = await createUser(prisma, overrides.user)

  const defaultAccountData = {
    accountPasswordHash: await bcryptjs.hash("1234", 10),
    idUser: user.id
  }

  const account = await prisma.accounts.create({
    data: { ...defaultAccountData, ...overrides.account }
  })

  return { user, account }
}
