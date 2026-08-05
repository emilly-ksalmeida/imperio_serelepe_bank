import request from "supertest";
import express from "express";
import routes from "../../src/routes/index.js";
import { prisma } from "../setup/prisma-cleaner.js";
import { createUserWithAccount } from "../factories/user.factory.js";

describe("GET /user-recovery", () => {
  describe("When the user starts the process to see the security question", () => {
    describe("When user enters a valid username", () => {
      it("should return 200 and the secret question", async () => {
        const { user } = await createUserWithAccount(prisma);

        const app = express();
        routes(app);

        const res = await request(app).get(`/user-recovery/${user.username}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          securityQuestion: user.securityQuestion,
        });
      });
    });

    describe("When user enters a non-existent username", () => {
      it("should return error status code 404", async () => {
        const app = express();
        routes(app);

        const res = await request(app).get(`/user-recovery/nonexistentuser`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error");
      });
    });

    describe("When user enters a username with invalid format", () => {
      it("should return error status code 422", async () => {
        const app = express();
        routes(app);

        const res = await request(app).get("/user-recovery/ab");

        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty("error");
      });
    });
  });
});
