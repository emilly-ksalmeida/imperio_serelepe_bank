import { z } from "zod";
import {
  getSecurityQuestionSchema,
  resetUserSchema,
} from "../../model/validateSchema.js";
import AuthService from "../../services/auth/auth.service.js";

export default class AuthController {
  constructor(authService = new AuthService()) {
    this.authService = authService;
  }

  async getUserSecurityQuestion(req, res) {
    const currentUsername = req.params.currentUsername;

    const validatedcurrentUsername =
      getSecurityQuestionSchema.safeParse(currentUsername);

    if (!validatedcurrentUsername.success) {
      const pretty = z.prettifyError(validatedcurrentUsername.error);

      throw new Error(pretty);
    }

    const question =
      await this.authService.getSecurityQuestion(currentUsername);

    res.status(200).json(question);
  }

  async resetPassword(req, res) {
    const resetData = req.body;

    const validatedResetData = resetUserSchema.safeParse(resetData);

    if (!validatedResetData.success) {
      const pretty = z.prettifyError(validatedResetData.error);

      throw new Error(pretty);
    }

    const result = await this.authService.execute(resetData);

    res.status(200).json(result);
  }
}
