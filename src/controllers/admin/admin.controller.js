import { z } from "zod";
import { adminResetPasswordSchema } from "../../model/validateSchema.js";
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
