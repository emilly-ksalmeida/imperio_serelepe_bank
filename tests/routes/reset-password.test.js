import request from "supertest";
import express from "express";
import routes from "../../src/routes/index.js";
import bcryptjs from "bcryptjs";
import { prisma } from "../setup/prisma-cleaner.js";
import { createUserWithAccount } from "../factories/user.factory.js";

describe("POST /reset-password", () => {
  describe("when a user try to reset password", () => {
    describe("with valid data", () => {
      it("should return status code 201 when the user sends the correct secret answer", async () => {
        const { user, account } = await createUserWithAccount(prisma);

        const app = express();
        routes(app);

        const res = await request(app).post("/reset-password").send({
          currentUsername: user.username,
          answer: "abcde",
          newPassword: "123456",
          newAccountPassword: "4321",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
          message: `${user.name}, senhas redefinidas com sucesso.`,
        });

        const updatedUser = await prisma.users.findUnique({
          where: { username: user.username },
          select: {
            passwordHash: true,
            name: true,
            securityQuestion: true,
            account: { select: { accountPasswordHash: true } },
          },
        });

        expect(updatedUser.passwordHash).not.toBe(user.passwordHash);
        expect(updatedUser.account.accountPasswordHash).not.toBe(
          account.accountPasswordHash,
        );

        expect(await bcryptjs.compare("123456", updatedUser.passwordHash)).toBe(
          true,
        );
        expect(await bcryptjs.compare("1234", updatedUser.passwordHash)).toBe(
          false,
        );

        expect(
          await bcryptjs.compare(
            "4321",
            updatedUser.account.accountPasswordHash,
          ),
        ).toBe(true);
        expect(
          await bcryptjs.compare(
            "1234",
            updatedUser.account.accountPasswordHash,
          ),
        ).toBe(false);

        expect(updatedUser.name).toBe(user.name);
        expect(updatedUser.securityQuestion).toBe(user.securityQuestion);
      });
    });
  });

  describe("when a user try to reset password", () => {
    describe("with invalid data", () => {
      it("should return status code 401 when the user sends the wrong secret answer", async () => {
        const { user } = await createUserWithAccount(prisma);

        const app = express();
        routes(app);

        const res = await request(app).post("/reset-password").send({
          currentUsername: user.username,
          answer: "invalid",
          newPassword: "123456",
          newAccountPassword: "1234",
        });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("error");
      });

      it("should return status code 422 when the user sends invalid data", async () => {
        const app = express();
        routes(app);

        const res = await request(app).post("/reset-password").send({
          currentUsername: "invalid-invalid",
          answer: "invalid",
          newPassword: "invalid",
          newAccountPassword: "invalid",
        });

        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({
          error:
            "✖ Dados inválidos.\n" +
            "  → at currentUsername\n" +
            "✖ A senha deve conter apenas números.\n" +
            "  → at newPassword\n" +
            "✖ A senha da conta precisa ter 4 dígitos.\n" +
            "  → at newAccountPassword\n" +
            "✖ A senha deve conter apenas números.\n" +
            "  → at newAccountPassword",
        });
      });
    });
  });
});
