import request from "supertest"
import express from "express"
import routes from "../../src/routes/index.js"
import { prisma } from "../setup/prisma-cleaner.js"
import { createUserWithAccount } from "../factories/user.factory.js"

describe("POST /login", () => {
  describe("when user has correct credentials", () => {
    it("should execute login", async () => {
      const { user, account } = await createUserWithAccount(prisma)

      const app = express()
      routes(app)

      console.log(user.username)
      const res = await request(app).post("/login").send({
        username: user.username,
        password: "1234"
      })

      expect(res.statusCode).toBe(201)

      expect(res.body).toEqual({
        userId: user.id,
        username: user.username,
        role: user.role,
        token: expect.any(String),
        accountId: account.id
      })
    })
  })

  describe("when user has incorrect credentials", () => {
    it("should return 401", async () => {
      const app = express()
      routes(app)
      const res = await request(app).post("/login").send({
        username: "invalid",
        password: "invalid"
      })
      expect(res.statusCode).toBe(403)
    })
  })
})