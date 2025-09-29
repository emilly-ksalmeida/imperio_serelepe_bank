import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { listAllUsers, createUser, loginUser, makeTransfer, getBalance, getStatement } from "../controller/controllers.js";

const routes = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.get("/", listAllUsers);
    
    app.get("/balance", verifyToken, getBalance);
   
    app.get("/statement", verifyToken, getStatement);

    app.post("/login", loginUser);

    app.post("/create-user", createUser);

    app.post("/make-transfer", verifyToken, makeTransfer);

}
export default routes;