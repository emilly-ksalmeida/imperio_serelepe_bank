import bcryptjs from "bcryptjs";
import { prisma } from "../../model/db.js";
import jwt from "jsonwebtoken";

class GenerateTokenService {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async execute(password, username) {
    const user = await this.repository.users.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new Error("Nome de usuário ou senha inválidos!");
    }

    const checkPassword = await bcryptjs.compare(password, user.passwordHash);

    if (!checkPassword) {
      throw new Error("Nome de usuário ou senha inválidos!");
    }

    const userAccountId = await this.repository.accounts.findUnique({
      where: { idUser: user.id },
      select: { id: true },
    });

    const token = this.generateJWT(user, userAccountId.id);

    return {
      userId: user.id,
      username: username,
      role: user.role,
      token: token,
      accountId: userAccountId.id,
    };
  }

  generateJWT(user, userAccountId) {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        userAccountId: { id: userAccountId },
      },
      process.env.SECRET_KEY,
      { expiresIn: process.env.TOKEN_EXP }
    );
  }
}

export default GenerateTokenService