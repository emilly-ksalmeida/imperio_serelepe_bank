import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { createUser, loginUser, makeTransfer, getBalance, getStatement, getUserSecurityQuestion, userResetPassword } from "../controller/controllers.js";

const routes = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    
    app.get("/balance", verifyToken, getBalance);
   
    app.get("/statement", verifyToken, getStatement);

    app.get("/user-recovery/:currentUsername", getUserSecurityQuestion);

    app.post("/login", loginUser);

    app.post("/create-user", createUser);

    app.post("/make-transfer", verifyToken, makeTransfer);

    app.patch("/reset-password", userResetPassword);

}
export default routes;