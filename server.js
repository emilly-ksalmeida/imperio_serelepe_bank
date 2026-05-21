import * as Sentry from "@sentry/node";
import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js";

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 1.0,
});

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PATCH", "PUT"],
    credentials: true,
  })
);

routes(app);

app.listen(process.env.PORT, () => {
  console.log("Servidor funcionando!!");
});
