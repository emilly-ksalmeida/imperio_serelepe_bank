import bcryptjs from "bcryptjs";
import AuthRepository from "../../repositories/auth.repository.js";
import { InvalidSecurityAnswerError } from "../../errors/auth/invalidSecurityAnswerError.error.js";

class AuthService {
  constructor(authRepository = new AuthRepository()) {
    this.authRepository = authRepository;
  }

  async execute(resetData) {
    const { currentUsername, answer, newPassword, newAccountPassword } =
      resetData;
    
    const verifySecurityAnswer = await this.#compareSecurityAnswer(
      currentUsername,
      answer,
    );

    if (!verifySecurityAnswer) {
      throw new InvalidSecurityAnswerError();
    }
  
    const newPasswordHash = await bcryptjs.hash(newPassword, 10);
    const newAccountPasswordHash = await bcryptjs.hash(newAccountPassword, 10);

    const result = await this.authRepository.resetPassword(
      currentUsername,
      newPasswordHash,
      newAccountPasswordHash,
    );

    return { message: `${result.name}, senhas redefinidas com sucesso.` };
  }

  async getSecurityQuestion(username) {
    const securityQuestion =
      await this.authRepository.getSecurityQuestion(username);

    return securityQuestion;
  }

  async #compareSecurityAnswer(username, answer) {
    const dbSecurityAnswer =
      await this.authRepository.getSecurityAnswer(username);

    const checkAnswer = await bcryptjs.compare(
      answer,
      dbSecurityAnswer.securityAnswer,
    );

    return checkAnswer;
  }
}

export default AuthService;
