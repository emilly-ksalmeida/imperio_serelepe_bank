import request from "supertest"
import express from "express"
import  routes  from "../../src/routes/index.js"
import { prisma } from "../setup/prisma-cleaner.js"
import { generateJWT } from "../../src/model/login.js"
import bcryptjs from "bcryptjs";
import { faker } from "@faker-js/faker"

describe("GET /balance", () => {
  describe("when user is not logged in", () => {
    it("should return 403", async () => {
      const app = express()
      routes(app)
      const res = await request(app).get("/balance")
      expect(res.statusCode).toBe(403)
    })
  })

  it("should return balance", async () => {
    const user = await prisma.users.create({
      data: {
        name: "user",
        username: faker.internet.username(),
        passwordHash: await bcryptjs.hash("1234", 10),
        securityQuestion: "abcde",
        securityAnswer: await bcryptjs.hash("abcde", 10),
        role: "user"
      }
    })

    const account = await prisma.accounts.create({
      data: {
        accountPasswordHash: await bcryptjs.hash("1234", 10),
        idUser: user.id
      }
    })

    token = generateJWT(user, account.id)

    const app = express()
    routes(app)

    const response = await request(app).get("/balance")
    .set("Authorization", `Bearer ${token}`)

    expect(response.body.balance).toBe("0")
    expect(response.statusCode).toBe(200)
  })
})