import request from "supertest"
import express from "express"
import routes from "../../src/routes/index.js"
import { faker } from "@faker-js/faker"
import { prisma } from "../setup/prisma-cleaner.js"

describe("POST /create-user", () => {
  describe("when user try to register", () => {
    describe("with valid data", () => {
      it("should return 201", async () => {
        const payload = {
          name: "João da Silva",
          username: faker.internet.username(),
          password: "12345",
          accountPassword: "5678",
          securityQuestion: "Qual é o nome do seu primeiro animal?",
          securityAnswer: "Rex",
        };

        const app = express()
        routes(app)

        const res = await request(app).post("/create-user")
          .send(payload)

        expect(res.statusCode).toBe(201)

        const userWithAccount = await prisma.users.findUnique({
          where: {
            username: payload.username
          },
          include: {
            account: true
          }
        })

        expect(res.body).toEqual({
          name: payload.name,
          numberAccount: userWithAccount.account.id,
          userId: userWithAccount.id
        })
      })
    })

    describe("with invalid data", () => {
      it("should return 400", async () => {
        const payload = {
          name: "João da Silva",
          username: faker.internet.username(),
          password: "12",
          accountPassword: "56",
          securityQuestion: "Qual é o nome do seu primeiro animal?",
          securityAnswer: "Rex",
        };

        const app = express()
        routes(app)

        const res = await request(app).post("/create-user")
          .send(payload)

        expect(res.statusCode).toBe(422)
      })
    })
  })
})