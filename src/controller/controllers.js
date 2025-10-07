import {
  createUserSchema,
  loginSchema,
  transferSchema,
  resetUserSchema
} from "../model/validateSchema.js";
import {
  list,
  getBalanceById,
  generateAccountStatement,
} from "../model/listUsers.js";
import { getSecurityQuestion, resetPassword } from "../model/userRecovery.js";
import newUser from "../model/newUser.js";
import transfer from "../model/transfers.js";
import login from "../model/login.js";

export async function listAllUsers(req, res) {
  try {
    const data = await list();
    res.status(200).json(data);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Erro: "Falha na requisição" });
  }
}

export async function createUser(req, res) {
  try {
    const newData = req.body;
    const validatedNewData = createUserSchema.safeParse(newData);
    if (!validatedNewData.success) {
      throw new Error(validatedNewData.error);
    }
    const createdUser = await newUser(newData);
    res.status(201).json(createdUser);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Erro: "Falha na requisição" });
  }
}

export async function loginUser(req, res) {
  try {
    const data = req.body;
    const validatedData = loginSchema.safeParse(data);
    if (!validatedData.success) {
      throw new Error(validatedData.error);
    }
    const createToken = await login(data);
    res.status(201).json(createToken);
  } catch (erro) {
    console.error(erro.message);
    res.status(401).json({ Erro: "Falha na requisição, dados inválidos" });
  }
}

export async function makeTransfer(req, res) {
  try {
    const data = req.body;
    const validatedData = transferSchema.parse(data);
    const { userAccountId } = req.dataCurrentUser;
    const atualizedData = {
      userAccountId: userAccountId.id,
      ...validatedData,
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
    res.status(500).json({ Erro: "Falha na requisição" });
  }
}
export async function getStatement(req, res) {
  try {
    const accountId = req.dataCurrentUser.userAccountId.id;
    const result = await generateAccountStatement(accountId);
    res.status(200).json(result);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Erro: "Falha na requisição" });
  }
}

export async function getUserSecurityQuestion(req, res) {
  try {
    const currentUsername = req.params.currentUsername;
    const question = await getSecurityQuestion(currentUsername);
    res.status(200).json(question);
  } catch (erro) {
    console.error(erro.message);
    res.status(404).json({ Erro: "Falha na requisição" });
  }
}
export async function userResetPassword(req, res) {
  try {
    const dataRecovery = req.body;
    const validatedDataRecovery = resetUserSchema.safeParse(dataRecovery);
    if (!validatedDataRecovery.success) {
      throw new Error(validatedDataRecovery.error);
    }
    const question = await resetPassword(dataRecovery);
    res.status(200).json(question);
  } catch (erro) {
    console.error(erro.message);
    res.status(400).json({ Erro: "Falha na requisição, dados inválidos" });
  }
}
