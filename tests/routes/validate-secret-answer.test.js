import request from "supertest"
import express from "express"
import routes from "../../src/routes/index.js"
import { prisma } from "../setup/prisma-cleaner.js"
import { createUserWithAccount } from "../factories/user.factory.js"

describe("POST /validate-secret-answer", () => {
  describe("when a user try to validate secret answer", () => {
    describe("with valid data", () => {
      it("should return 201", async () => {
        const { user } = await createUserWithAccount(prisma)

        const app = express()
        routes(app)

        const res = await request(app).post("/validate-secret-answer")
          .send({
            currentUsername: user.username,
            answer: "abcde"
          })

        expect(res.statusCode).toBe(200)
      })
    })

    describe("with invalid data", () => {
      it("should return 401", async () => {
        const { user } = await createUserWithAccount(prisma)

        const app = express()
        routes(app)

        const res = await request(app).post("/validate-secret-answer")
          .send({
            currentUsername: user.username,
            answer: "wroong answer"
          })

        expect(res.statusCode).toBe(401)
      })
    })
  })
})