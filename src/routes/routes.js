import express from "express";
import fazerLogin from "../model/login.js";
import autenticacaoToken from "../middleware/token.js";
import { listarTodosUsuarios, criarUsuario, fazerTransferencia } from "../controller/controllers.js";

const routes = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.get("/", autenticacaoToken, listarTodosUsuarios);

    app.post("/login", fazerLogin);

    app.post("/adicionar-usuario", criarUsuario);

    app.post("/fazer-transferencia", autenticacaoToken, fazerTransferencia);

}
export default routes;