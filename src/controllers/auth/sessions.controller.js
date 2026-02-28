import { z } from "zod";

import {
  loginSchema,
} from "../../model/validateSchema.js";

import login  from "../../model/login.js";

class SessionsController {
  async loginUser(req, res) {
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
}

export default SessionsController;
