import express from "express";
import cors from "cors";
import routes from "./src/routes/routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT"],
    credentials: true,
  })
);

routes(app);

app.listen(process.env.PORT, () => {
  console.log("Servidor funcionando!!");
});
