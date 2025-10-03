import bcryptjs from "bcryptjs";
import prisma from "./db.js";

export default async function newUser(data) {
  const { name, username, password, accountPassword } = data;

  const passwordHash = await bcryptjs.hash(password, 10);
  const accountPasswordHash = await bcryptjs.hash(accountPassword, 10);

  return prisma.$transaction(async (tx) => {
    const newUser = await tx.users.create({
      data: {
        name,
        username,
        passwordHash,
      },
    });
    const newAccount = await tx.account.create({
      data: {
        accountPasswordHash,
        idUser: newUser.id,
      },
    });
    return `Usuário ${name} criado com sucesso (id ${newUser.id}), seu número de conta é: ${newAccount.id}`;
  });
}
