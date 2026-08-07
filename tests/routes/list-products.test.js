import request from "supertest";
import express from "express";
import routes from "../../src/routes/index.js";
import { prisma } from "../setup/prisma.js";
import { generateJWT } from "../helper/auth-helper.js";
import { createUserSeller } from "../factories/seller.factory.js";
import { createUserWithAccount } from "../factories/user.factory.js";

describe("GET /products", () => {
  describe("when the user is authenticated", () => {
    it("should return 200 and an empty list when there are no products in the showcase", async () => {
      const { user, account } = await createUserWithAccount(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(user, account.id);

      const response = await request(app)
        .get("/products")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return 200 and the products registered in the showcase", async () => {
      await createUserSeller(prisma, {
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

      const { user, account } = await createUserWithAccount(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(user, account.id);

      const response = await request(app)
        .get("/products")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: "Caderno 10 matérias",
            description: "Caderno espiral capa dura",
            unitPrice: "24.9",
            imgUrl: "imgproducts.jpg",
          }),
          expect.objectContaining({
            id: expect.any(Number),
            name: "Caneta azul",
            description: "Caneta esferográfica ponta fina",
            unitPrice: "2.5",
            imgUrl: "imgproducts.jpg",
          }),
        ]),
      );
    });

    it("should return 200 without the out-of-stock product in the showcase", async () => {
      await createUserSeller(prisma, {
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
          {
            name: "Lápis HB",
            description: "Lápis grafite nº 2",
            unitPrice: 1.2,
            stockQuantity: 0,
            imgUrl: "imgproducts.jpg",
          },
        ],
      });

      const { user, account } = await createUserWithAccount(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(user, account.id);

      const response = await request(app)
        .get("/products")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body.map((product) => product.name)).not.toContain(
        "Lápis HB",
      );
    });

    it("should return only the showcase fields, without stock or isActive", async () => {
      await createUserSeller(prisma, {
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

      const { user, account } = await createUserWithAccount(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(user, account.id);

      const response = await request(app)
        .get("/products")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body[0]).toEqual({
        id: expect.any(Number),
        name: "Caderno 10 matérias",
        description: "Caderno espiral capa dura",
        unitPrice: "24.9",
        imgUrl: "imgproducts.jpg",
      });
      expect(response.body[0]).not.toHaveProperty("stockQuantity");
      expect(response.body[0]).not.toHaveProperty("isActive");
    });

    it("should return 200 with products from different sellers in the showcase", async () => {
      await createUserSeller(prisma, {
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

      const { user, account } = await createUserWithAccount(prisma);

      const app = express();
      routes(app);

      const token = await generateJWT(user, account.id);

      const response = await request(app)
        .get("/products")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body.map((product) => product.name).sort()).toEqual([
        "Caderno 10 matérias",
        "Lápis HB",
      ]);
    });

    it("should return 200 when a seller accesses the showcase", async () => {
      const seller = await createUserSeller(prisma, {
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

      const app = express();
      routes(app);

      const token = await generateJWT(seller, seller.account.id);

      const response = await request(app)
        .get("/products")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe("when the user is not authorized", () => {
    it("should return 403 when there is no token", async () => {
      const app = express();
      routes(app);

      const response = await request(app).get("/products");

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: "Token não fornecido." });
    });

    it("should return 403 when the token is invalid", async () => {
      const invalidToken =
        "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAzMmNhOTMwLWIxMWUtNDE4Yy1iNTFkLTU0NDU1MDEzM2I3YiIsInVzZXJuYW1lIjoidXNlcjEiLCJuYW1lIjoidXNlciIsInJvbGUiOiJ1c2VyIiwidXNlckFjY291bnRJZCI6eyJpZCI6IlVUT18ifSwiaWF0IjoxNzg0ODEyNDg3LCJleHAiOjE3ODQ4NTU2ODd9.0AKf5Y9TRO-OykWEinuds_CI0nT_dkYRMtVXPL91iu8";

      const app = express();
      routes(app);

      const response = await request(app)
        .get("/products")
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: "Token inválido." });
    });
  });
});
