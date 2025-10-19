import express from "express";
import cors from "cors";
import routes from "./src/routes/routes.js";

const app = express();

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
