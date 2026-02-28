import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { createUser, makeTransfer, getBalance, getStatement, getUserSecurityQuestion, userResetPassword, validateSecretAnswer, getProducts, createProduct, createPurchase } from "../controllers/controllers.js";

import SessionsController from "../controllers/sessions.controller.js";

const routes = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    const sessionsController = new SessionsController();
    //Serelepepay
    app.get("/balance", verifyToken, getBalance);

    app.get("/statement", verifyToken, getStatement);

    app.get("/user-recovery/:currentUsername", getUserSecurityQuestion);

    app.post("/login", sessionsController.loginUser);

    app.post("/create-user", createUser);

    app.post("/make-transfer", verifyToken, makeTransfer);

    app.post("/validate-secret-answer", validateSecretAnswer);

    app.patch("/reset-password", userResetPassword);

    //Serelepe Market
    app.get("/products", getProducts);

    app.post("/create-product", createProduct);

    app.post("/create-purchase", verifyToken, createPurchase);

}

export default routes;