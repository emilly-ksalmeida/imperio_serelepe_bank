import { z } from "zod";
import {
  adminCreateProductSchema,
  adminResetPasswordSchema,
  sellerIdQuerySchema,
  updateProductSchema,
} from "../../model/validateSchema.js";
import { ValidationError } from "../../errors/products/validationError.error.js";
import { AdminService } from "../../services/admin/admin.service.js";

export default class AdminController {
  constructor(adminService = new AdminService()) {
    this.adminService = adminService;
  }

  async getAllUsers(req, res, _next) {
    const allUsers = await this.adminService.getAllUsers();
    res.status(200).json(allUsers);
  }

  async getSellers(req, res) {
    const sellers = await this.adminService.getSellers();
    res.status(200).json(sellers);
  }

  async getSellerProducts(req, res) {
    const validatedQuery = sellerIdQuerySchema.safeParse(req.query);

    if (!validatedQuery.success) {
      const pretty = z.prettifyError(validatedQuery.error);
      throw new ValidationError(pretty);
    }

    const products = await this.adminService.getProductsBySeller(
      validatedQuery.data.sellerId,
    );
    res.status(200).json(products);
  }

  async createProduct(req, res) {
    const productData = req.body;

    const validatedProductData =
      adminCreateProductSchema.safeParse(productData);

    if (!validatedProductData.success) {
      const pretty = z.prettifyError(validatedProductData.error);
      throw new ValidationError(pretty);
    }

    const product = await this.adminService.createProduct(
      validatedProductData.data,
    );
    res.status(201).json(product);
  }

  async updateProduct(req, res) {
    const { productId } = req.params;
    const updateData = req.body;

    const validatedNewData = updateProductSchema.safeParse(updateData);
    if (!validatedNewData.success) {
      const pretty = z.prettifyError(validatedNewData.error);
      throw new ValidationError(pretty);
    }

    const updatedProduct = await this.adminService.updateProduct(
      productId,
      validatedNewData.data,
    );
    res.status(200).json(updatedProduct);
  }

  async resetPassword(req, res) {
    const resetData = req.body;

    const validatedResetData = adminResetPasswordSchema.safeParse(resetData);

    if (!validatedResetData.success) {
      const pretty = z.prettifyError(validatedResetData.error);

      throw new ValidationError(pretty);
    }

    const { username, newPassword } = validatedResetData.data;

    const result = await this.adminService.resetPassword(
      username,
      newPassword,
    );

    res.status(200).json(result);
  }
}
