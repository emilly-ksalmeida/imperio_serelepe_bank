import { prisma } from "../../model/db.js";
import checkPassword from "../../utils/check-password.js";

export class FinalizePurchaseService {
  constructor(repository = prisma) {
    this.repository = repository;
  }

  async execute(payload) {
    console.log(payload);
    const hash = await this.#findPasswordHash(payload.userId);
    const verifyPassword = await checkPassword(
      payload.password,
      hash.passwordHash,
    );
    console.log(verifyPassword);

    if (!verifyPassword) {
      throw new Error("Senha da conta incorreta");
    }
    // confirm order service

    return;
  }

  async #findPasswordHash(id) {
    return await this.repository.users.findUnique({
      where: {
        id: id,
      },
      select: {
        passwordHash: true,
      },
    });
  }
}

export default FinalizePurchaseService;
