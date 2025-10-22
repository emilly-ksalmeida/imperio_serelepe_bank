import bcryptjs from "bcryptjs";
import {prisma} from "./db.js";

export async function getSecurityQuestion(currentUsername) {
  const userSecurityQuestion = await prisma.users.findUnique({
    where: { username: currentUsername },
    select: { securityQuestion: true },
  });
  return userSecurityQuestion;
}

export async function resetPassword(data) {
  const { currentUsername, answer, newPassword } = data;

  const userSecurityAnswer = await prisma.users.findUnique({
    where: { username: currentUsername },
    select: { securityAnswer: true },
  });
  if (!userSecurityAnswer) {
    throw new Error("Dados inválidos!");
  }

  const checkAnswer = await bcryptjs.compare(answer, userSecurityAnswer.securityAnswer);
  if (!checkAnswer) {
    throw new Error("Dados inválidos!");
  }

  const newPasswordHash = await bcryptjs.hash(newPassword, 10);
  const passwordUpdate = await prisma.users.update({
    where: {
      username: currentUsername,
    },
    data: {
      passwordHash: newPasswordHash,
    },
  });
  return {message: "Senha redefinida com sucesso!"};
}
