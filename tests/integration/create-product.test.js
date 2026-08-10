import request from "supertest";
import express from "express";
import routes from "../../src/routes/index.js";
import { prisma } from "../setup/prisma.js";
import { generateJWT } from "../helper/auth-helper.js";
import { createUserSeller } from "../factories/seller.factory.js";
import { createUserWithAccount } from "../factories/user.factory.js";

describe("POST /products", () => {
  describe("Quando um seller tenta cadastrar um produto", () => {
    describe("Quando o seller está autenticado", () => {
      it("deve retornar 201 e persistir o produto no banco quando envia todos os dados corretos", async () => {
        const seller = await createUserSeller(prisma);

        const productData = {
          name: "Caderno",
          description: "Caderno com 96 folhas pautadas",
          unitPrice: 400,
          stockQuantity: 10,
          imgUrl: "exemple.jpg",
        };

        const app = express();
        routes(app);

        const token = await generateJWT(seller, seller.account.id);

        const response = await request(app)
          .post("/products")
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

      it("deve retornar 422 quando envia dados do produto fora do padrão", async () => {
        const seller = await createUserSeller(prisma);

        const productData = {
          name: "Caderno",
          description: "abc",
          unitPrice: -1,
          stockQuantity: 10,
          imgUrl: "exemple.jpg",
        };

        const app = express();
        routes(app);

        const token = await generateJWT(seller, seller.account.id);

        const response = await request(app)
          .post("/products")
          .set("Authorization", `Bearer ${token}`)
          .send(productData);

        expect(response.statusCode).toBe(422);
        expect(response.body.error).toBeDefined();
      });
    });

    describe("Quando o seller está com token inválido", () => {
      it("deve retornar 403 e não cadastrar o produto", async () => {
        const sellerId = "235b4126-5868-414a-acb7-cd50f428cf99";
        const invalidToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIzNWI0MTI2LTU4NjgtNDE0YS1hY2I3LWNkNTBmNDI4Y2Y5OSIsInVzZXJuYW1lIjoic2VsbGVyMSIsIm5hbWUiOiJzZWxsZXIiLCJyb2xlIjoic2VsbGVyIiwidXNlckFjY291bnRJZCI6eyJpZCI6Iks4clcifSwiaWF0IjoxNzgwNDAzNTM3LCJleHAiOjE3ODA0NDY3Mzd9.mT057luvy2kOqbQrASKEmDmHJm8cbcUQJ7B8F6aXVg0";

        const productData = {
          name: "Caderno",
          description: "Caderno com 96 folhas pautadas",
          unitPrice: 400,
          stockQuantity: 10,
          imgUrl: "exemple.jpg",
        };

        const app = express();
        routes(app);

        const response = await request(app)
          .post("/products")
          .set("Authorization", `Bearer ${invalidToken}`)
          .send(productData);

        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({ message: "Token inválido." });

        const persistedProduct = await prisma.products.findFirst({
          where: { sellerId: sellerId },
        });
        expect(persistedProduct).toBeNull();
      });
    });
  });

  describe("Quando um user comum tenta criar um produto", () => {
    it("deve retornar 403 quando um usuário não-seller tenta cadastrar um produto", async () => {
      const { user, account } = await createUserWithAccount(prisma);

      const productData = {
        name: "Caderno",
        description: "Caderno com 96 folhas pautadas",
        unitPrice: 400,
        stockQuantity: 10,
        imgUrl: "exemple.jpg",
      };

      const app = express();
      routes(app);

      const token = await generateJWT(user, account.id);

      const response = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .send(productData);

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({
        error: "Você não possui permissão para acessar este recurso",
      });

      const persistedProduct = await prisma.products.findFirst({
        where: { sellerId: user.id },
      });
      expect(persistedProduct).toBeNull();
    });
  });
});
