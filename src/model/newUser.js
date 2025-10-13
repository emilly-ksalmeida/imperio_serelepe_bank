import bcryptjs from "bcryptjs";
import prisma from "./db.js";

export default async function newUser(data) {
  const { name, username, password, accountPassword, securityQuestion, securityAnswer } = data;

  const passwordHash = await bcryptjs.hash(password, 10);
  const accountPasswordHash = await bcryptjs.hash(accountPassword, 10);
  const securityAnswerHash = await bcryptjs.hash(securityAnswer, 10);

  return prisma.$transaction(async (tx) => {
    const newUser = await tx.users.create({
      data: {
        name,
        username,
        passwordHash,
        securityQuestion,
        securityAnswer: securityAnswerHash
      },
    });
    const newAccount = await tx.accounts.create({
      data: {
        accountPasswordHash,
        idUser: newUser.id,
      },
    });
    return { name: name, userId: newUser.id, numberAccount: newAccount.id };
  });
}
