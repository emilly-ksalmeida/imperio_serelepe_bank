import * as Sentry from "@sentry/node";
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyRole from "../middleware/verifyRole.js";

import SessionsController from "../controllers/auth/sessions.controller.js";
import UsersController from "../controllers/users/users.controller.js";
import TransactionsController from "../controllers/bank/transactions.controller.js";
import AccountBalanceController from "../controllers/bank/account-balance.controller.js";
import SecurityQuestionController from "../controllers/auth/security-question.controller.js";
import PasswordResetController from "../controllers/auth/password-reset.controller.js";
import ProductsController from "../controllers/market/products.controller.js";
import OrdersController from "../controllers/market/orders.controller.js";
import errorHandler from "../errors/errorHandler.js";

const routes = (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const sessionsController = new SessionsController();
  const usersController = new UsersController();
  const transactionsController = new TransactionsController();
  const accountBalanceController = new AccountBalanceController();
  const securityQuestionController = new SecurityQuestionController();
  const passwordResetController = new PasswordResetController();
  const productsController = new ProductsController();
  const ordersController = new OrdersController();

  // Auth routes
  app.post("/login", (req, res) => sessionsController.loginUser(req, res));
  app.get("/user-recovery/:currentUsername", (req, res) =>
    securityQuestionController.getUserSecurityQuestion(req, res),
  );
  app.post("/validate-secret-answer", (req, res) =>
    securityQuestionController.validateSecretAnswer(req, res),
  );
  app.patch("/reset-password", (req, res) =>
    passwordResetController.userResetPassword(req, res),
  );

  // User routes
  app.post("/create-user", (req, res) => usersController.createUser(req, res));

  // Bank routes
  app.get("/balance", verifyToken, (req, res, next) =>
    accountBalanceController.getBalance(req, res, next),
  );
  app.get("/statement", verifyToken, (req, res, next) =>
    transactionsController.getStatement(req, res, next),
  );
  app.post("/make-transfer", verifyToken, (req, res, next) =>
    transactionsController.makeTransfer(req, res, next),
  );

  // Market routes - products management
  app.get("/products", verifyToken, (req, res) =>
    productsController.getProducts(req, res),
  );
  app.post("/products", verifyToken, verifyRole, (req, res) =>
    productsController.createProduct(req, res),
  );
  app.get("/products/seller", verifyToken, verifyRole, (req, res) =>
    productsController.getSellerProducts(req, res),
  );
  app.put("/products/seller/:productId", verifyToken, verifyRole, (req, res) =>
    productsController.updateProduct(req, res),
  );
  // Adicionar delete app.delete("/")

  //  Market routes - orders
  app.get("/orders", verifyToken, (req, res) => ordersController.listOrder(req, res));
  app.post("/orders/finalize", verifyToken, (req, res) => ordersController.finalizeOrder(req, res));

  app.get("/debug-sentry", (_req, _res) => {
    throw new Error("Sentry funcionando");
  });

  Sentry.setupExpressErrorHandler(app);

  app.use(errorHandler);
};

export default routes;
