import bcryptjs from "bcryptjs";
import { prisma } from "../../model/db.js";

class VerifySecretAnswerService {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async execute(currentUsername, secretAnswer) {
    const dbUserSecurityAnswer = await this.repository.users.findUnique({
      where: { username: currentUsername },
      select: { securityAnswer: true },
    });

    const checkAnswer = await bcryptjs.compare(secretAnswer, dbUserSecurityAnswer.securityAnswer);

    return checkAnswer;
  }
}

export default VerifySecretAnswerService