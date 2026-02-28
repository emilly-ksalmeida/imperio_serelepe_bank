import { z } from "zod";
import {
  resetUserSchema,
  productSchema,
} from "../model/validateSchema.js";
import { getSecurityQuestion, validateAnswer,resetPassword } from "../model/userRecovery.js";
import { getAllProducts, newProduct } from "../model/products.js";
import PurchaseService from "../model/purchase.js";


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