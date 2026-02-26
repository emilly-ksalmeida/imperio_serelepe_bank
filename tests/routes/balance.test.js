import request from "supertest"
import express from "express"
import  routes  from "../../src/routes/index.js"
import { prisma } from "../../src/model/db.js"
import { be } from "zod/locales"

describe("GET /balance", () => {

  it("should return balance", async () => {
    const app = express()

    routes(app)

    const res = await request(app).get("/balance")

    expect(res.statusCode).toBe(200)
  })
})