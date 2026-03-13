import { z } from "zod";

import {
  productSchema,
} from "../../model/validateSchema.js";

import ProductsService from "../../model/products.service.js";

class ProductsController {
constructor(
  productsService = new ProductsService()
) {
  this.productsService = productsService;
}

  async  getProducts(req, res) {
    try {
      const allProducts = await this.productsService.getAllProducts();
      res.status(200).json(allProducts);
    } catch (erro) {
      console.error(erro.message);
      res.status(500).json({ Erro: erro.message });
    }
  }

   async  createProduct(req, res) {
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
}

export default ProductsController