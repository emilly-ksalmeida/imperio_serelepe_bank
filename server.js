import dotenv from "dotenv";
dotenv.config();

import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});

import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js";

const app = express();

const origensPermitidas = (process.env.ORIGIN || "")
  .split(",")
  .map((origem) => origem.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origem, callback) => {
      const permitida = Boolean(origem) && origensPermitidas.includes(origem);
      callback(null, permitida);
    },
    methods: ["GET", "POST", "PATCH", "PUT"],
    credentials: true,
  })
);

routes(app);

app.listen(process.env.PORT, () => {
  console.log("Servidor funcionando!!");
});
