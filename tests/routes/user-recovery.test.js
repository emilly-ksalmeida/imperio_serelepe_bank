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

        const res = await request(app).get(`/user-recovery/${user.username}`)

        expect(res.statusCode).toBe(200)

        expect(res.body).toEqual({
          securityQuestion: user.securityQuestion
        })
      })
    })

    describe("with invalid data", () => {
      it("should return 401", async () => {
        const app = express()
        routes(app)

        const res = await request(app).get(`/user-recovery/invalid-username`)

        expect(res.statusCode).toBe(404)
      })
    })
  })
})