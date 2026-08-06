import request from "supertest";
import express from "express";
import routes from "../../src/routes/index.js";
import { prisma } from "../setup/prisma-cleaner.js";
import { generateJWT } from "../helper/auth-helper.js";
import { createUserSeller } from "../factories/seller.factory.js";
import { createUserWithAccount } from "../factories/user.factory.js";

describe("GET /products/seller", () => {
  describe("quando um seller lista os produtos", () => {
    it("deve retornar 200 e apenas os próprios produtos", async () => {
      const seller1 = await createUserSeller(prisma, {
        productData: [
          {
            name: "Caderno 10 matérias",
            description: "Caderno espiral capa dura",
            unitPrice: 24.9,
            stockQuantity: 80,
            imgUrl: "imgproducts.jpg",
          },
          {
            name: "Caneta azul",
            description: "Caneta esferográfica ponta fina",
            unitPrice: 2.5,
            stockQuantity: 300,
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
          {
            name: "Borracha branca",
            description: "Borracha macia sem manchas",
            unitPrice: 1.99,
            stockQuantity: 150,
            imgUrl: "imgproducts.jpg",
          },
        ],
      });

      const app = express();
      routes(app);

      const token = await generateJWT(seller1, seller1.account.id);

      const response = await request(app)
        .get("/products/seller")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body.map((product) => product.name).sort()).toEqual([
        "Caderno 10 matérias",
        "Caneta azul",
      ]);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: "Caderno 10 matérias",
            description: "Caderno espiral capa dura",
            unitPrice: "24.9",
            stockQuantity: 80,
            imgUrl: "imgproducts.jpg",
          }),
          expect.objectContaining({
            id: expect.any(Number),
            name: "Caneta azul",
            description: "Caneta esferográfica ponta fina",
            unitPrice: "2.5",
            stockQuantity: 300,
            imgUrl: "imgproducts.jpg",
          }),
        ]),
      );
    });

    it("deve retornar 200 e lista vazia quando o seller não tem produtos", async () => {
      const seller3 = await createUserSeller(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(seller3, seller3.account.id);

      const response = await request(app)
        .get("/products/seller")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("seller A não vê os produtos do seller B", async () => {
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

      const token = await generateJWT(seller1, seller1.account.id);

      const response = await request(app)
        .get("/products/seller")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe("Caderno 10 matérias");
    });
  });

  describe("quando o usuário não está autorizado", () => {
    it("deve retornar 403 quando não há token", async () => {
      const app = express();
      routes(app);

      const response = await request(app).get("/products/seller");

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: "Token não fornecido." });
    });

    it("deve retornar 403 quando o token é inválido", async () => {
      const invalidToken =
        "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAzMmNhOTMwLWIxMWUtNDE4Yy1iNTFkLTU0NDU1MDEzM2I3YiIsInVzZXJuYW1lIjoidXNlcjEiLCJuYW1lIjoidXNlciIsInJvbGUiOiJ1c2VyIiwidXNlckFjY291bnRJZCI6eyJpZCI6IlVUT18ifSwiaWF0IjoxNzg0ODEyNDg3LCJleHAiOjE3ODQ4NTU2ODd9.0AKf5Y9TRO-OykWEinuds_CI0nT_dkYRMtVXPL91iu8";

      const app = express();
      routes(app);

      const response = await request(app)
        .get("/products/seller")
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: "Token inválido." });
    });

    it("deve retornar 403 quando um usuário comum tenta acessar", async () => {
      const { user, account } = await createUserWithAccount(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(user, account.id);

      const response = await request(app)
        .get("/products/seller")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({
        error: "Você não possui permissão para acessar este recurso",
      });
    });
  });
});
