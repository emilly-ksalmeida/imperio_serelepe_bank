import { getSecurityQuestion } from "../../model/userRecovery.js";
import VerifySecretAnswerService from "../../services/auth/verify-secret-answer.service.js";

class SecurityQuestionController {
  constructor(
    verifySecretAnswerService = new VerifySecretAnswerService()
  ) {
    this.verifySecretAnswerService = verifySecretAnswerService;
  }

  async getUserSecurityQuestion(req, res) {
    try {
      const currentUsername = req.params.currentUsername;
      const question = await getSecurityQuestion(currentUsername);
      res.status(200).json(question);
    } catch (erro) {
      console.error(erro.message);
      res.status(404).json({ Erro: erro.message });
    }
  }

  async validateSecretAnswer(req, res) {
    try {
      const { currentUsername, answer } = req.body;

      const result = await this.verifySecretAnswerService.execute(
        currentUsername,
        answer
      );

      if (!result) {
        throw new Error("Resposta inválida.");
      }

      res.status(200).json(result);
    } catch (erro) {
      console.error(erro.message);
      res.status(401).json({ Erro: erro.message });
    }
  }
}

export default SecurityQuestionController