import { z } from "zod";

import {
  createProductSchema,
  updateProductSchema,
} from "../../model/validateSchema.js";

import ProductsService from "../../services/products/products.service.js";
import { ValidationError } from "../../errors/products/validationError.error.js";

class ProductsController {
  constructor(productsService = new ProductsService()) {
    this.productsService = productsService;
  }

  async getProducts(req, res) {
    const allProducts = await this.productsService.getAllProducts();
    res.status(200).json(allProducts);
  }

  async getSellerProducts(req, res) {
    const sellerId = req.dataCurrentUser.id;
    const sellerProducts =
      await this.productsService.getProductsBySeller(sellerId);
    res.status(200).json(sellerProducts);
  }

  async createProduct(req, res) {
    const productData = req.body;
    const sellerId = req.dataCurrentUser.id;

    const validatedProductData = createProductSchema.safeParse(productData);

    if (!validatedProductData.success) {
      const pretty = z.prettifyError(validatedProductData.error);
      throw new ValidationError(pretty);
    }
    const product = await this.productsService.newProduct({
      ...validatedProductData.data,
      sellerId: sellerId,
    });

    res.status(201).json(product);
  }

  async updateProduct(req, res) {
    const { productId } = req.params;
    const updateData = req.body;
    const currentUserId = req.dataCurrentUser.id;

    const validatedNewData = updateProductSchema.safeParse(updateData);
    if (!validatedNewData.success) {
      const pretty = z.prettifyError(validatedNewData.error);
      throw new ValidationError(pretty, 422);
    }
    const updatedProduct = await this.productsService.updateProduct(
      productId,
      currentUserId,
      updateData,
    );
    res.status(200).json(updatedProduct);
  }

  async deleteProduct(req, res) {
    const { productId } = req.params;
    const currentUserId = req.dataCurrentUser.id;
    const _deletedProduct = await this.productsService.deleteProduct(
      productId,
      currentUserId,
    );
    res.status(204).json("Produto deletado");
  }
}

export default ProductsController;
