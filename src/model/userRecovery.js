import bcryptjs from "bcryptjs";
import {prisma} from "./db.js";

export async function getSecurityQuestion(currentUsername) {
  const userSecurityQuestion = await prisma.users.findUnique({
    where: { username: currentUsername },
    select: { securityQuestion: true },
  });
  if(!userSecurityQuestion){
    throw new Error("Nome de usuário inválido ou não informado!");
  }
  return userSecurityQuestion;
}

export async function validateAnswer(currentUsername, answer){
  const dbUserSecurityAnswer = await prisma.users.findUnique({
    where: { username: currentUsername },
    select: { securityAnswer: true },
  });
  const checkAnswer = await bcryptjs.compare(answer, dbUserSecurityAnswer.securityAnswer);
  return checkAnswer;
}

export async function resetPassword(data) {
  const { currentUsername, newPassword, newAccountPassword } = data;
  const newPasswordHash = await bcryptjs.hash(newPassword, 10);
  const newAccountPasswordHash = await bcryptjs.hash(newAccountPassword, 10);
  const dataUpdate = await prisma.users.update({
    where: {
      username: currentUsername,
    },
    data: {
      passwordHash: newPasswordHash,
      account: {
        update: {
          accountPasswordHash: newAccountPasswordHash
        }
      }
    },
    select: {
      username: true
    }
  });

  return {message: `${dataUpdate.username}, senhas redefinidas com sucesso.`};
}
