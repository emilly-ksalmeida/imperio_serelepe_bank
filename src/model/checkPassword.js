import bcryptjs from "bcryptjs";
import { prisma } from "./db.js";

export default class PasswordCheck {
  constructor(data) {
    this.userAccountId = data.userAccountId;
    this.accountPassword = data.accountPassword;
   
  }

  async verify() {
    const from = await prisma.accounts.findUnique({
      where: { id: this.userAccountId },
      select: { accountPasswordHash: true },
    });
    const checkPassword = await bcryptjs.compare(
      this.accountPassword,
      from.accountPasswordHash,
    );
    if (!checkPassword) {
      throw new Error("Senha da conta incorreta!!");
    }
  }

}
