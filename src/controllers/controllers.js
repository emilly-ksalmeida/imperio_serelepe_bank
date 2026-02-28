import { z } from "zod";
import { prismaImport } from "../model/db.js";
import {
  createUserSchema,
  loginSchema,
  transferSchema,
  resetUserSchema,
  productSchema,
} from "../model/validateSchema.js";
import {
  getBalanceById,
  generateAccountStatement,
} from "../model/listUsers.js";
import { getSecurityQuestion, validateAnswer,resetPassword } from "../model/userRecovery.js";
import newUser from "../model/newUser.js";
import transfer from "../model/transfers.js";
import login from "../model/login.js";
import { getAllProducts, newProduct } from "../model/products.js";
import PurchaseService from "../model/purchase.js";

// users.controller.ts [POST] /
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
    if (erro instanceof prismaImport.PrismaClientKnownRequestError) {
      if (erro.code === "P2002") {
        return res
          .status(422)
          .json({ Erro: "Você não pode usar esse username, escolha outro." });
      }
      return res
        .status(422)
        .json({ Erro: "Falha ao cadastrar, tente novamente." });
    }
    res.status(422).json({ Erro: erro.message });
  }
}

// sessions.controller.ts [POST] /login
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


// account-balance.controller.ts [GET] /user/balance
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


// transactions.controller.ts [POST] /transactions (CREATE)
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

// transactions.controller.ts [GET] /transactions (LIST)
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

// security-question.controller.ts [GET] /recovery
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

// security-question.controller.ts [GET]
export async function validateSecretAnswer(req, res) {
  try{
    const {currentUsername, answer} = req.body;
    const result = await validateAnswer(currentUsername, answer);
    if(!result){
      throw new Error("Resposta inválida.");
    }
    res.status(200).json(result);

  }catch (erro) {
    console.error(erro.message);
    res.status(401).json({ Erro: erro.message });
  }
}

// password-reset.controller.ts
export async function userResetPassword(req, res) {
  try {
    const dataRecovery = req.body;
    const validatedDataRecovery = resetUserSchema.safeParse(dataRecovery);
    if (!validatedDataRecovery.success) {
      const pretty = z.prettifyError(validatedDataRecovery.error);
      throw new Error(pretty);
    }
    const resetResult = await resetPassword(dataRecovery);
    res.status(200).json(resetResult);
  } catch (erro) {
    console.error(erro.message);
    res.status(400).json({ Erro: erro.message });
  }
}

//Serelepe Market
export async function getProducts(req, res) {
  try {
    const allProducts = await getAllProducts();
    res.status(200).json(allProducts);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Erro: erro.message });
  }
}

export async function createProduct(req, res) {
  try {
    const productData = req.body;
    const validatedProductData = productSchema.safeParse(productData);
    if (!validatedProductData.success) {
      const pretty = z.prettifyError(validatedProductData.error);
      throw new Error(pretty);
    }
    const product = await newProduct(productData);
    res.status(201).json(product);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Erro: erro.message });
  }
}

export async function createPurchase(req, res) {
  try{
    const purchaseList = req.body;
    const { id, userAccountId } = req.dataCurrentUser;
    const atualizedData = {
      userId: id,
      userAccountId: userAccountId.id,
      ...purchaseList,
    };

    //verificar o estoque de cada produto de cada vendedor da lista de compras. Se todos os produtos tiverem estoque retornar true, se ao menos 1 produto não tiver estoque retornar false e informar quais produtos estão indisponíveis. (essa função pode ser feita no model, recebendo a purchaseList como parametro).
    const verificacao = new PurchaseService(atualizedData);
    await verificacao.validateItemsStock();


    if(verificacao.outOfStockItems.length > 0){
      return res.status(422).json({
        message: "Alguns produtos estão indisponíveis no momento.",
        items: verificacao.outOfStockItems.map(item => ({
          name: item.name,
          availableStock: item.availableStock
        }))
      });
    } else {
      return res.status(201).json({ message: "compra realizada com sucesso" });
    }
    //se a verificação for bem sucedida, gerar a transferencia para pagamento (percorrer o array purchase extraido do body).

    //Baixa no estoque tabela products


    //Registrar Order


    //Registrar OrderItem


    //Fazer transferencia para pagamento


    // Responder compra feita com sucesso


  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ Erro: erro.message });
  }
}