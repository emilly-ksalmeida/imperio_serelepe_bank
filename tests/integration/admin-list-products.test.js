import { randomUUID } from "node:crypto";
import request from "supertest";
import express from "express";
import routes from "../../src/routes/index.js";
import { prisma } from "../setup/prisma.js";
import { generateJWT } from "../helper/auth-helper.js";
import { createUserAdmin } from "../factories/admin.factory.js";
import { createUserSeller } from "../factories/seller.factory.js";
import { createUserWithAccount } from "../factories/user.factory.js";

describe("GET /admin/products", () => {
  describe("quando um admin lista os produtos de um seller", () => {
    it("deve retornar 200 apenas com os produtos do seller informado", async () => {
      const admin = await createUserAdmin(prisma);
      const seller1 = await createUserSeller(prisma, {
        productData: [
          {
            name: "Caderno 10 matérias",
            description: "Caderno espiral capa dura",
            unitPrice: 24.9,
            stockQuantity: 80,
            imgUrl: "imgproducts.jpg",
          },
        ],
      });
      await createUserSeller(prisma, {
        productData: [
          {
            name: "Lápis HB",
            description: "Lápis grafite nº 2",
            unitPrice: 1.2,
            stockQuantity: 500,
            imgUrl: "imgproducts.jpg",
          },
        ],
      });

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .get(`/admin/products?sellerId=${seller1.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: "Caderno 10 matérias",
          stockQuantity: 80,
        }),
      );
    });

    it("deve retornar 200 com lista vazia quando o seller não tem produtos", async () => {
      const admin = await createUserAdmin(prisma);
      const seller = await createUserSeller(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .get(`/admin/products?sellerId=${seller.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("deve retornar 422 quando o sellerId não é informado", async () => {
      const admin = await createUserAdmin(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .get("/admin/products")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(422);
    });

    it("deve retornar 422 quando o sellerId não tem formato de uuid", async () => {
      const admin = await createUserAdmin(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .get("/admin/products?sellerId=123")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(422);
    });

    it("deve retornar 404 quando o sellerId não existe", async () => {
      const admin = await createUserAdmin(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .get(`/admin/products?sellerId=${randomUUID()}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });

    it("deve retornar 404 quando o usuário informado não é um seller", async () => {
      const admin = await createUserAdmin(prisma);
      const { user } = await createUserWithAccount(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .get(`/admin/products?sellerId=${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe("quando o usuário não está autorizado", () => {
    it("deve retornar 403 quando um seller tenta acessar", async () => {
      const seller = await createUserSeller(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(seller, seller.account.id);

      const response = await request(app)
        .get(`/admin/products?sellerId=${seller.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({
        error: "Você não possui permissão para acessar este recurso",
      });
    });

    it("deve retornar 403 quando não há token", async () => {
      const app = express();
      routes(app);

      const response = await request(app).get("/admin/products");

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: "Token não fornecido." });
    });
  });
});
