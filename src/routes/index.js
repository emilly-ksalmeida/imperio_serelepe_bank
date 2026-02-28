import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getUserSecurityQuestion, userResetPassword, validateSecretAnswer, getProducts, createProduct, createPurchase } from "../controllers/controllers.js";

import SessionsController from "../controllers/sessions.controller.js";
import UsersController from "../controllers/users.controller.js";
import TransactionsController from "../controllers/transactions.controller.js";
import AccountBalanceController from "../controllers/account-balance.controller.js";

const routes = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    const sessionsController = new SessionsController();
    const usersController = new UsersController();
    const transactionsController = new TransactionsController();
    const accountBalanceController = new AccountBalanceController();

    //Serelepepay
    app.get("/balance", verifyToken, accountBalanceController.getBalance);

    app.get("/statement", verifyToken, transactionsController.getStatement);

    app.get("/user-recovery/:currentUsername", getUserSecurityQuestion);

    app.post("/login", sessionsController.loginUser);

    app.post("/create-user", usersController.createUser);

    app.post("/make-transfer", verifyToken, transactionsController.makeTransfer);

    app.post("/validate-secret-answer", validateSecretAnswer);

    app.patch("/reset-password", userResetPassword);

    //Serelepe Market
    app.get("/products", getProducts);

    app.post("/create-product", createProduct);

    app.post("/create-purchase", verifyToken, createPurchase);

}

export default routes;