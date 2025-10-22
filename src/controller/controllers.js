import { z } from "zod";
import {
  createUserSchema,
  loginSchema,
  transferSchema,
  resetUserSchema
} from "../model/validateSchema.js";
import {
  getBalanceById,
  generateAccountStatement,
} from "../model/listUsers.js";
import { getSecurityQuestion, resetPassword } from "../model/userRecovery.js";
import newUser from "../model/newUser.js";
import transfer from "../model/transfers.js";
import login from "../model/login.js";

export async function createUser(req, res) {
  try {
    const newData = req.body;
    const validatedNewData = createUserSchema.safeParse(newData);
    if (!validatedNewData.success) {
      const pretty = z.prettifyError(validatedNewData.error);
      throw new Error(pretty);
    }
    const createdUser = await newUser(newData);
    res.status(201).json(createdUser);
  } catch (erro) {
    console.error(erro.message);
    res.status(422).json({ Erro: erro.message });
  }
}

export async function loginUser(req, res) {
  try {
    const data = req.body;
    const validatedData = loginSchema.safeParse(data);
    if (!validatedData.success) {
      const pretty = z.prettifyError(validatedData.error);
      throw new Error(pretty);
    }
    const createToken = await login(data);
    res.status(201).json(createToken);
  } catch (erro) {
    console.error(erro.message);
    res.status(403).json({ Erro: erro.message });
  }
}

export async function makeTransfer(req, res) {
  try {
    const data = req.body;
    const validatedData = transferSchema.safeParse(data);
    if (!validatedData.success) {
      const pretty = z.prettifyError(validatedData.error);
      throw new Error(pretty);
    }
    const { userAccountId } = req.dataCurrentUser;
    const atualizedData = {
      userAccountId: userAccountId.id,
      ...data,
    };
    const result = await transfer(atualizedData);
    res.status(201).json(result);
  } catch (erro) {
    console.error(erro);
    res.status(422).json({ Erro: erro.message });
  }
}
export async function getBalance(req, res) {
  try {
    const accountId = req.dataCurrentUser.userAccountId.id;
    const result = await getBalanceById(accountId);
    res.status(200).json(result);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Erro: erro.message });
  }
}
export async function getStatement(req, res) {
  try {
    const accountId = req.dataCurrentUser.userAccountId.id;
    const result = await generateAccountStatement(accountId);
    res.status(200).json(result);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Erro: erro.message });
  }
}

export async function getUserSecurityQuestion(req, res) {
  try {
    const currentUsername = req.params.currentUsername;
    const question = await getSecurityQuestion(currentUsername);
    res.status(200).json(question);
  } catch (erro) {
    console.error(erro.message);
    res.status(404).json({ Erro: erro.message });
  }
}
export async function userResetPassword(req, res) {
  try {
    const dataRecovery = req.body;
    const validatedDataRecovery = resetUserSchema.safeParse(dataRecovery);
    if (!validatedDataRecovery.success){
      const pretty = z.prettifyError(validatedDataRecovery.error);
      throw new Error(pretty);
    }
    const question = await resetPassword(dataRecovery);
    res.status(200).json(question);
  } catch (erro) {
    console.error(erro.message);
    res.status(400).json({ Erro: erro.message });
  }
}
