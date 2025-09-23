import express from "express";
import login from "../model/login.js";
import verifyToken from "../middleware/verifyToken.js";
import { listAllUsers, createUser, makeTransfer, getBalance } from "../controller/controllers.js";

const routes = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.get("/", verifyToken, listAllUsers);
    app.get("/balance/:id", verifyToken, getBalance);
    app.post("/login", login);

    app.post("/create-user", createUser);

    app.post("/make-transfer", verifyToken, makeTransfer);

}
export default routes;