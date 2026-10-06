import request from "supertest";
import express from "express";
import routes from "../../src/routes/index.js";
import { prisma } from "../setup/prisma.js";
import { generateJWT } from "../helper/auth-helper.js";
import { createUserAdmin } from "../factories/admin.factory.js";
import { createUserSeller } from "../factories/seller.factory.js";
import { createUserWithAccount } from "../factories/user.factory.js";

describe("POST /admin/products", () => {
  describe("quando um admin cadastra um produto para um seller", () => {
    it("deve retornar 201 e persistir o produto com o sellerId do seller informado", async () => {
      const admin = await createUserAdmin(prisma);
      const seller = await createUserSeller(prisma);

      const productData = {
        name: "Caderno",
        description: "Caderno com 96 folhas pautadas",
        unitPrice: 400,
        stockQuantity: 10,
        imgUrl: "exemple.jpg",
        sellerUsername: seller.username,
      };

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .post("/admin/products")
        .set("Authorization", `Bearer ${token}`)
        .send(productData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(Number),
        name: "Caderno",
      });

      const persistedProduct = await prisma.products.findUnique({
        where: { id: response.body.id, sellerId: seller.id },
        select: {
          name: true,
          description: true,
          stockQuantity: true,
          unitPrice: true,
        },
      });

      expect(persistedProduct).toMatchObject({
        name: "Caderno",
        description: "Caderno com 96 folhas pautadas",
        stockQuantity: 10,
      });

      expect(Number(persistedProduct.unitPrice)).toBe(400);
    });

    it("deve retornar 422 quando o sellerUsername não é informado", async () => {
      const admin = await createUserAdmin(prisma);

      const productData = {
        name: "Caderno",
        description: "Caderno com 96 folhas pautadas",
        unitPrice: 400,
        stockQuantity: 10,
        imgUrl: "exemple.jpg",
      };

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .post("/admin/products")
        .set("Authorization", `Bearer ${token}`)
        .send(productData);

      expect(response.statusCode).toBe(422);
    });

    it("deve retornar 422 quando os dados do produto estão fora do padrão", async () => {
      const admin = await createUserAdmin(prisma);
      const seller = await createUserSeller(prisma);

      const productData = {
        name: "",
        description: "curta",
        unitPrice: 0,
        stockQuantity: -1,
        sellerUsername: seller.username,
      };

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .post("/admin/products")
        .set("Authorization", `Bearer ${token}`)
        .send(productData);

      expect(response.statusCode).toBe(422);
    });

    it("deve retornar 404 quando o sellerUsername não existe", async () => {
      const admin = await createUserAdmin(prisma);

      const productData = {
        name: "Caderno",
        description: "Caderno com 96 folhas pautadas",
        unitPrice: 400,
        stockQuantity: 10,
        imgUrl: "exemple.jpg",
        sellerUsername: "usuarioqueexiste123",
      };

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .post("/admin/products")
        .set("Authorization", `Bearer ${token}`)
        .send(productData);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        error: "A operação falhou, usuário não encontrado.",
      });
    });

    it("deve retornar 404 quando o sellerUsername pertence a um usuário que não é seller", async () => {
      const admin = await createUserAdmin(prisma);
      const { user } = await createUserWithAccount(prisma);

      const productData = {
        name: "Caderno",
        description: "Caderno com 96 folhas pautadas",
        unitPrice: 400,
        stockQuantity: 10,
        imgUrl: "exemple.jpg",
        sellerUsername: user.username,
      };

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .post("/admin/products")
        .set("Authorization", `Bearer ${token}`)
        .send(productData);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        error: "A operação falhou, usuário não encontrado.",
      });
    });
  });

  describe("quando o usuário não está autorizado", () => {
    it("deve retornar 403 quando um seller tenta acessar", async () => {
      const seller = await createUserSeller(prisma);

      const productData = {
        name: "Caderno",
        description: "Caderno com 96 folhas pautadas",
        unitPrice: 400,
        stockQuantity: 10,
        imgUrl: "exemple.jpg",
        sellerUsername: seller.username,
      };

      const app = express();
      routes(app);

      const token = await generateJWT(seller, seller.account.id);

      const response = await request(app)
        .post("/admin/products")
        .set("Authorization", `Bearer ${token}`)
        .send(productData);

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({
        error: "Você não possui permissão para acessar este recurso",
      });
    });

    it("deve retornar 403 quando não há token", async () => {
      const app = express();
      routes(app);

      const response = await request(app).post("/admin/products").send({});

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: "Token não fornecido." });
    });
  });
});
