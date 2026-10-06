import request from "supertest";
import express from "express";
import routes from "../../src/routes/index.js";
import { prisma } from "../setup/prisma.js";
import { generateJWT } from "../helper/auth-helper.js";
import { createUserAdmin } from "../factories/admin.factory.js";
import { createUserSeller } from "../factories/seller.factory.js";
import { createUserWithAccount } from "../factories/user.factory.js";

describe("PUT /admin/products/:productId", () => {
  describe("quando um admin atualiza um produto", () => {
    it("deve retornar 200 e persistir a alteração mesmo sendo produto de outro seller", async () => {
      const admin = await createUserAdmin(prisma);
      const seller = await createUserSeller(prisma, {
        productData: {
          name: "Caderno",
          description: "Caderno com 96 folhas pautadas",
          unitPrice: 400,
          stockQuantity: 10,
          imgUrl: "exemple.jpg",
        },
      });

      const updateData = {
        name: "Caderno Espiral",
        description: "Caderno espiral com capa dura e 96 folhas",
        unitPrice: 450,
        stockQuantity: 25,
        imgUrl: "exemple2.jpg",
      };

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .put(`/admin/products/${seller.product[0].id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ id: seller.product[0].id });

      const persistedProduct = await prisma.products.findUnique({
        where: { id: seller.product[0].id },
        select: {
          name: true,
          description: true,
          stockQuantity: true,
          unitPrice: true,
          isActive: true,
          sellerId: true,
        },
      });

      expect(persistedProduct).toMatchObject({
        name: "Caderno Espiral",
        description: "Caderno espiral com capa dura e 96 folhas",
        stockQuantity: 25,
        sellerId: seller.id,
      });

      expect(Number(persistedProduct.unitPrice)).toBe(450);
      expect(persistedProduct.isActive).toBe(true);
    });

    it("deve retornar 404 quando o produto não existe", async () => {
      const admin = await createUserAdmin(prisma);

      const updateData = {
        name: "Caderno Espiral",
        description: "Caderno espiral com capa dura e 96 folhas",
        unitPrice: 450,
        stockQuantity: 25,
        imgUrl: "exemple2.jpg",
      };

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .put("/admin/products/999999")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        error: "A operação falhou, produto não encontrado.",
      });
    });

    it("deve retornar 422 quando os dados do produto estão fora do padrão", async () => {
      const admin = await createUserAdmin(prisma);
      const seller = await createUserSeller(prisma, {
        productData: {
          name: "Caderno",
          description: "Caderno com 96 folhas pautadas",
          unitPrice: 400,
          stockQuantity: 10,
          imgUrl: "exemple.jpg",
        },
      });

      const updateData = {
        name: "",
        description: "curta",
        unitPrice: 0,
        stockQuantity: -1,
      };

      const app = express();
      routes(app);

      const token = await generateJWT(admin, admin.account.id);

      const response = await request(app)
        .put(`/admin/products/${seller.product[0].id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(422);
    });
  });

  describe("quando o usuário não está autorizado", () => {
    it("deve retornar 403 quando um seller tenta acessar", async () => {
      const seller = await createUserSeller(prisma, {
        productData: {
          name: "Caderno",
          description: "Caderno com 96 folhas pautadas",
          unitPrice: 400,
          stockQuantity: 10,
          imgUrl: "exemple.jpg",
        },
      });

      const updateData = {
        name: "Caderno Espiral",
        description: "Caderno espiral com capa dura e 96 folhas",
        unitPrice: 450,
        stockQuantity: 25,
        imgUrl: "exemple2.jpg",
      };

      const app = express();
      routes(app);

      const token = await generateJWT(seller, seller.account.id);

      const response = await request(app)
        .put(`/admin/products/${seller.product[0].id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({
        error: "Você não possui permissão para acessar este recurso",
      });
    });

    it("deve retornar 403 quando um usuário comum tenta acessar", async () => {
      const { user, account } = await createUserWithAccount(prisma);

      const updateData = {
        name: "Caderno Espiral",
        description: "Caderno espiral com capa dura e 96 folhas",
        unitPrice: 450,
        stockQuantity: 25,
        imgUrl: "exemple2.jpg",
      };

      const app = express();
      routes(app);

      const token = await generateJWT(user, account.id);

      const response = await request(app)
        .put("/admin/products/1")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({
        error: "Você não possui permissão para acessar este recurso",
      });
    });

    it("deve retornar 403 quando não há token", async () => {
      const app = express();
      routes(app);

      const response = await request(app).put("/admin/products/1").send({});

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: "Token não fornecido." });
    });
  });
});
