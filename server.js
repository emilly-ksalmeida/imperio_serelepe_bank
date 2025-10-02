import express from "express";
import cors from "cors";
import routes from "./src/routes/routes.js";

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],      
  credentials: true                
}));

routes(app);

app.listen(3000, ()=>{
    console.log("Servidor funcionando!!");
});