import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getProducts, createProduct, createPurchase } from "../controllers/controllers.js";

import SessionsController from "../controllers/auth/sessions.controller.js";
import UsersController from "../controllers/users/users.controller.js";
import TransactionsController from "../controllers/bank/transactions.controller.js";
import AccountBalanceController from "../controllers/bank/account-balance.controller.js";
import SecurityQuestionController from "../controllers/bank/security-question.controller.js";
import PasswordResetController from "../controllers/auth/password-reset.controller.js";

const routes = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    const sessionsController = new SessionsController();
    const usersController = new UsersController();
    const transactionsController = new TransactionsController();
    const accountBalanceController = new AccountBalanceController();
    const securityQuestionController = new SecurityQuestionController();
    const passwordResetController = new PasswordResetController();

    //Serelepepay
    app.get("/balance", verifyToken, accountBalanceController.getBalance);
    app.get("/statement", verifyToken, transactionsController.getStatement);
    app.get("/user-recovery/:currentUsername", securityQuestionController.getUserSecurityQuestion);
    app.post("/login", sessionsController.loginUser);
    app.post("/create-user", usersController.createUser)
    app.post("/make-transfer", verifyToken, transactionsController.makeTransfer);
    app.post("/validate-secret-answer", securityQuestionController.validateSecretAnswer);
    app.patch("/reset-password", passwordResetController.userResetPassword);

    //Serelepe Market
    app.get("/products", getProducts);

    app.post("/create-product", createProduct);

    app.post("/create-purchase", verifyToken, createPurchase);

}

export default routes;