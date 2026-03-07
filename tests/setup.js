import { cleaner, prisma } from "./setup/prisma-cleaner.js"

beforeAll(async () => {
  await prisma.$connect()
})

afterEach(async () => {
  await cleaner.cleanup()
})

afterAll(async () => {
  await prisma.$disconnect()
})