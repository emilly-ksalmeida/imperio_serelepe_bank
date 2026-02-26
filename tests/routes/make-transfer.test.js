import request from "supertest"
import express from "express"
import routes from "../../src/routes/index.js"
import { prisma } from "../setup/prisma-cleaner.js"
import { generateJWT } from "../../src/model/login.js"
import { createUserWithAccount } from "../factories/user.factory.js"

describe("POST /make-transfer", () => {
  describe("when user is not logged in", () => {
    it("should return 403", async () => {
      const app = express()
      routes(app)
      const res = await request(app).post("/make-transfer")
      expect(res.statusCode).toBe(403)
    })
  })

  describe("creating a transfer", () => {
    describe("when the user has available balance", () => {
      it("should return 201", async () => {
        const { user: adan, account: adanAccount } = await createUserWithAccount(prisma, {
          user: { name: "adan" },
          account: { balance: 1000 }
        })

        const { user: maria, account: mariaAccount } = await createUserWithAccount(prisma, {
          user: { name: "maria" },
          account: {}
        })

        const token = await generateJWT(adan, adanAccount.id)

        const payload = {
          toAccountId: mariaAccount.id,
          accountPassword: '1234',
          value: "50"
        }

        const app = express()
        routes(app)

        const res = await request(app).post("/make-transfer")
          .set("Authorization", `Bearer ${token}`)
          .send(payload)

        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual(expect.objectContaining({
          value: "50",
          fromId: adanAccount.id,
          toId: mariaAccount.id
        }))
      })

      it("should create transfers and update balances", async () => {
        const { user: adan, account: adanAccount } = await createUserWithAccount(prisma, {
          user: { name: "adan" },
          account: { balance: 1000 }
        })

        const { account: mariaAccount } = await createUserWithAccount(prisma, {
          user: { name: "maria" },
          account: {}
        })

        const token = await generateJWT(adan, adanAccount.id)

        const payload = {
          toAccountId: mariaAccount.id,
          accountPassword: '1234',
          value: "50"
        }

        const app = express()
        routes(app)

        const res = await request(app).post("/make-transfer")
          .set("Authorization", `Bearer ${token}`)
          .send(payload)

        expect(res.statusCode).toBe(201)

        const updatedAdanAccount = await prisma.accounts.findUnique({
          where: {
            id: adanAccount.id
          }
        })

        const updatedMariaAccount = await prisma.accounts.findUnique({
          where: {
            id: mariaAccount.id
          }
        })

        expect(Number(updatedAdanAccount.balance)).toBe(950)
        expect(Number(updatedMariaAccount.balance)).toBe(50)
      })
    })

    describe("when the user does not have available balance", () => {
      it("should return 400", async () => {
        const { user: adan, account: adanAccount } = await createUserWithAccount(prisma, {
          user: { name: "adan" },
          account: { balance: 1000 }
        })

        const { account: mariaAccount } = await createUserWithAccount(prisma, {
          user: { name: "maria" },
          account: {}
        })

        const token = await generateJWT(adan, adanAccount.id)

        const payload = {
          toAccountId: mariaAccount.id,
          accountPassword: '1234',
          value: "5000"
        }

        const app = express()
        routes(app)

        const res = await request(app).post("/make-transfer")
          .set("Authorization", `Bearer ${token}`)
          .send(payload)


        expect(res.statusCode).toBe(422)
        expect(res.body).toEqual({
          Erro: "Não existe saldo suficiente para mandar o valor $5000"
        })

        const updatedAdanAccount = await prisma.accounts.findUnique({
          where: {
            id: adanAccount.id
          }
        })

        const updatedMariaAccount = await prisma.accounts.findUnique({
          where: {
            id: mariaAccount.id
          }
        })

        expect(Number(updatedAdanAccount.balance)).toBe(1000)
        expect(Number(updatedMariaAccount.balance)).toBe(0)
      })
    })
  })
})
