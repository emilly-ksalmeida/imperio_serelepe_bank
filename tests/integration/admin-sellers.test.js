import request from "supertest";
import express from "express";
import routes from "../../src/routes/index.js";
import { prisma } from "../setup/prisma.js";
import { generateJWT } from "../helper/auth-helper.js";
import { createUserAdmin } from "../factories/admin.factory.js";
import { createUserSeller } from "../factories/seller.factory.js";
import { createUserWithAccount } from "../factories/user.factory.js";

describe("GET /admin/sellers", () => {
  describe("quando um admin lista os vendedores", () => {
    it("deve retornar 200 com todos os sellers e não incluir usuários comuns nem admins", async () => {
      const admin = await createUserAdmin(prisma);
      const seller1 = await createUserSeller(prisma);
      const seller2 = await createUserSeller(prisma);
      await createUserWithAccount(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .get("/admin/sellers")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: seller1.id,
            name: seller1.name,
            username: seller1.username,
          }),
          expect.objectContaining({
            id: seller2.id,
            name: seller2.name,
            username: seller2.username,
          }),
        ]),
      );
      expect(response.body.map((seller) => seller.id)).not.toContain(admin.id);
    });

    it("deve retornar 200 com lista vazia quando não há sellers", async () => {
      const admin = await createUserAdmin(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .get("/admin/sellers")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("quando o usuário não está autorizado", () => {
    it("deve retornar 403 quando um seller tenta acessar", async () => {
      const seller = await createUserSeller(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(seller, seller.account.id);

      const response = await request(app)
        .get("/admin/sellers")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({
        error: "Você não possui permissão para acessar este recurso",
      });
    });

    it("deve retornar 403 quando um usuário comum tenta acessar", async () => {
      const { user, account } = await createUserWithAccount(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(user, account.id);

      const response = await request(app)
        .get("/admin/sellers")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({
        error: "Você não possui permissão para acessar este recurso",
      });
    });

    it("deve retornar 403 quando não há token", async () => {
      const app = express();
      routes(app);

      const response = await request(app).get("/admin/sellers");

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: "Token não fornecido." });
    });
  });
});
