import { z } from "zod";

import { productSchema } from "../../model/validateSchema.js";

import ProductsService from "../../model/products.service.js";
import { prismaImport } from "../../model/db.js";

class ProductsController {
  constructor(productsService = new ProductsService()) {
    this.productsService = productsService;
  }

  async getProducts(req, res) {
    try {
      const allProducts = await this.productsService.getAllProducts();
      res.status(200).json(allProducts);
    } catch (erro) {
      console.error(erro.message);
      res.status(500).json({ Erro: erro.message });
    }
  }

  async getSellerProducts(req, res) {
    try {
      const sellerId = req.dataCurrentUser.id;
      const sellerProducts =
        await this.productsService.getProductsBySeller(sellerId);
      res.status(200).json(sellerProducts);
    } catch (erro) {
      console.error(erro.message);
      res.status(403).json({ Erro: erro.message });
    }
  }

  async createProduct(req, res) {
    try {
      const productData = req.body;
      const validatedProductData = productSchema.safeParse(productData);
      if (!validatedProductData.success) {
        const pretty = z.prettifyError(validatedProductData.error);
        throw new Error(pretty);
      }
      const product = await this.productsService.newProduct(productData);
      res.status(201).json(product);
    } catch (erro) {
      console.error(erro.message);
      res.status(500).json({ Erro: erro.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { productId } = req.params;
      const updateData = req.body;
      const currentUserId = req.dataCurrentUser.id;
      const validatedNewData = productSchema.safeParse(updateData);
      if (!validatedNewData.success) {
        const pretty = z.prettifyError(validatedNewData.error);
        throw new Error(pretty);
      }
      const updatedProduct = await this.productsService.updateProduct(
        productId,
        currentUserId,
        updateData,
      );
      res.status(200).json(updatedProduct);
    } catch (erro) {
      console.log(erro);
      if (erro instanceof prismaImport.PrismaClientKnownRequestError) {
        if (erro.code === "P2025") {
          return res
            .status(403)
            .json({ Erro: "Não é possível atualizar este produto" });
        }
        return res
          .status(404)
          .json({ Erro: "Não é possível atualizar este produto" });
      }
      res.status(422).json({ Erro: erro.message });
    }
  }
}

export default ProductsController;
