import { z } from "zod";

import {
  loginSchema,
} from "../../model/validateSchema.js";

import GenerateTokenService from "../../services/auth/generate-token.service.js";
class SessionsController {
  constructor(generateTokenService = new GenerateTokenService()) {
    this.generateTokenService = generateTokenService;
  }

  async loginUser(req, res) {
    try {
      const data = req.body;
      const validatedData = loginSchema.safeParse(data);

      if (!validatedData.success) {
        const pretty = z.prettifyError(validatedData.error);
        throw new Error(pretty);
      }

      const {password, username} = validatedData.data;

      const token = await this.generateTokenService.execute(password, username);

      res.status(201).json(token);
    } catch (erro) {
      console.error(erro);
      res.status(403).json({ Erro: erro.message });
    }
  }
}

export default SessionsController;
