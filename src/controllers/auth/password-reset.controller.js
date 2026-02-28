import { z } from "zod";
import {
  resetUserSchema,
} from "../../model/validateSchema.js";

import { resetPassword } from "../../model/userRecovery.js";

class PasswordResetController {
  async userResetPassword(req, res) {
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
}

export default PasswordResetController