import request from "supertest"
import express from "express"
import routes from "../../src/routes/index.js"
import { prisma } from "../setup/prisma-cleaner.js"
import { createUserWithAccount } from "../factories/user.factory.js"

describe("PATCH /reset-password", () => {
  describe("when a user try to reset password", () => {
    describe("with valid data", () => {
      it("should return 201", async () => {
        const { user } = await createUserWithAccount(prisma)

        const app = express()
        routes(app)

        const res = await request(app).patch("/reset-password")
          .send({
            currentUsername: user.username,
            newPassword: "123456",
            newAccountPassword: "1234"
          })

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(
          { message: `${user.username}, senhas redefinidas com sucesso.` }
        )
      })
    })
  })

  describe("when a user try to reset password", () => {
    describe("with invalid data", () => {
      it("should return 201", async () => {
        const { user } = await createUserWithAccount(prisma)

        const app = express()
        routes(app)

        const res = await request(app).patch("/reset-password")
          .send({
            currentUsername: 'invalid',
            newPassword: "invalid",
            newAccountPassword: "invalid"
          })

        expect(res.statusCode).toBe(400)

        expect(res.body).toEqual(
          {
            Erro: '✖ A senha deve conter apenas números.\n' +
              '  → at newPassword\n' +
              '✖ A senha da conta precisa ter 4 dígitos.\n' +
              '  → at newAccountPassword\n' +
              '✖ A senha deve conter apenas números.\n' +
              '  → at newAccountPassword'
          }
        )
      })
    })
  })
})