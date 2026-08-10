import request from "supertest"
import express from "express"
import routes from "../../src/routes/index.js"
import { prisma } from "../setup/prisma.js"
import { generateJWT } from "../helper/auth-helper.js"
import { createUser, createUserWithAccount } from "../factories/user.factory.js"

describe("GET /statement", () => {
  describe("when user is not logged in", () => {
    it("should return 403", async () => {
      const app = express()
      routes(app)
      const res = await request(app).get("/statement")
      expect(res.statusCode).toBe(403)
    })
  })

  describe("when the user has not made any transactions yet", () => {
    it("should return a empty array", async () => {
      const user = await createUser(prisma)
      const token = await generateJWT(user.id)
      const app = express()
      routes(app)
      const res = await request(app).get("/statement")
        .set("Authorization", `Bearer ${token}`)

      expect(res.body).toEqual([])
      expect(res.statusCode).toBe(200)
    })

  })

  describe("when the user has made transactions", () => {
    it("should return the transactions", async () => {
      const { user: adan, account: adanAccount } = await createUserWithAccount(prisma, {
        user: { name: "adan" },
        account: {}
      })

      const { account: mariaAccount } = await createUserWithAccount(prisma, {
        user: { name: "maria" },
        account: {}
      })

      // transaction from adan to maria
      await prisma.transfers.create({
        data: {
          value: 100,
          fromId: adanAccount.id,
          toId: mariaAccount.id
        }
      })

      // transaction from maria to adan
      await prisma.transfers.create({
        data: {
          value: 50,
          fromId: mariaAccount.id,
          toId: adanAccount.id
        }
      })

      const token = await generateJWT(adan, adanAccount.id)

      const app = express()
      routes(app)
      const res = await request(app).get("/statement")
        .set("Authorization", `Bearer ${token}`)


      expect(res.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
          value: "50",
          fromAccountId: mariaAccount.id,
          toAccountId: adanAccount.id,
          fromAccountName: "maria",
          toAccountName: "adan"
        }),
        expect.objectContaining({
          value: "100",
          fromAccountId: adanAccount.id,
          toAccountId: mariaAccount.id,
          fromAccountName: "adan",
          toAccountName: "maria"
        }),
      ]))

      expect(res.statusCode).toBe(200)
    })
  })
})