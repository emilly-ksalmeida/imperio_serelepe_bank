import { z } from "zod";

import {
  productSchema,
  updateProductSchema,
} from "../../model/validateSchema.js";

import ProductsService from "../../services/products/products.service.js";
import ProductsError from "../../errors/productsError.error.js";
import { ValidationError } from "../../errors/validationError.error.js";
import { AppError } from "../../errors/app.error.js";

class ProductsController {
  constructor(productsService = new ProductsService()) {
    this.productsService = productsService;
  }

  async getProducts(req, res) {
    try {
      const allProducts = await this.productsService.getAllProducts();
      res.status(200).json(allProducts);
    } catch (error) {
      return this.#handleError(error, res);
    }
  }

  async getSellerProducts(req, res) {
    try {
      const sellerId = req.dataCurrentUser.id;
      const sellerProducts =
        await this.productsService.getProductsBySeller(sellerId);
      res.status(200).json(sellerProducts);
    } catch (error) {
      return this.#handleError(error, res);
    }
  }

  async createProduct(req, res) {
    try {
      const productData = req.body;
      const sellerId = req.dataCurrentUser.id;

      const validatedProductData = productSchema.safeParse(productData);
      if (!validatedProductData.success) {
        const pretty = z.prettifyError(validatedProductData.error);
        throw new ValidationError(pretty);
      }
      const product = await this.productsService.newProduct({
        ...validatedProductData.data,
        sellerId: sellerId,
      });

      res.status(201).json(product);
    } catch (error) {
      return this.#handleError(error, res);
    }
  }

  async updateProduct(req, res) {
    try {
      const { productId } = req.params;
      const updateData = req.body;
      const currentUserId = req.dataCurrentUser.id;

      const validatedNewData = updateProductSchema.safeParse(updateData);
      if (!validatedNewData.success) {
        const pretty = z.prettifyError(validatedNewData.error);
        throw new ProductsError(pretty, 422);
      }
      const updatedProduct = await this.productsService.updateProduct(
        productId,
        currentUserId,
        updateData,
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      return this.#handleError(error, res);
    }
  }

  async deleteProduct(req, res) {
    try {
      const { productId } = req.params;
      const currentUserId = req.dataCurrentUser.id;
      const _deletedProduct = await this.productsService.deleteProduct(
        productId,
        currentUserId,
      );
      res.status(204).json("Produto deletado");
    } catch (error) {
      return this.#handleError(error, res);
    }
  }

  #handleError(error, res) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}

export default ProductsController;
