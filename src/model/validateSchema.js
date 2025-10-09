import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres.")
    .max(70, "Nome deve ter no máximo 70 caracteres.")
    .nonempty("Nome é obrigatório.")
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
      "Nome deve conter apenas letras e espaços."
    )
    .refine(
      (name) => name.trim().length > 0,
      "Nome não pode conter apenas espaços."
    ),
  username: z
    .string()
    .min(3, "Username deve ter no mínimo 3 caracteres.")
    .max(20, "Username deve ter no máximo 20 caracteres.")
    .nonempty("Nome de Usuário é obrigatório.")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Username só pode conter letras, números, . ou _, não pode conter espaços."
    ),
  password: z
    .string()
    .min(4, "A senha deve ter no mínimo 4 dígitos.")
    .max(8, "A senha deve ter no máximo 8 dígitos.")
    .nonempty("A senha de login é obrigatória.")
    .regex(/^[0-9]+$/, "A senha deve conter apenas números."),
  accountPassword: z
    .string()
    .length(4, "A senha da conta precisa ter 4 dígitos.")
    .nonempty("A senha de conta é obrigatória.")
    .regex(/^[0-9]+$/, "A senha deve conter apenas números."),
  securityQuestion: z
    .string()
    .nonempty("A pergunta secreta é obrigatória.")
    .max(100, "Quantidade máxima de caracteres  é 100."),
  securityAnswer: z
    .string()
    .max(100, "Quantidade máxima de caracteres  é 100.")
    .nonempty("A resposta secreta é obrigatória."),
});

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Dados inválidos.")
    .max(20, "Dados inválidos.")
    .nonempty("Nome de Usuário é obrigatório.")
    .regex(/^[a-zA-Z0-9._]+$/, "Dados inválidos."),
  password: z
    .string()
    .min(4, "Dados inválidos.")
    .max(8, "Dados inválidos.")
    .nonempty("A senha de login é obrigatória.")
    .regex(/^[0-9]+$/, "Dados inválidos."),
});

export const transferSchema = z.object({
  toAccountId: z
    .string()
    .length(4, "Código da conta inválido.")
    .nonempty("Nome de Usuário é obrigatório.")
  ,
  value: z
    .string()
    .nonempty("O valor é obrigatório")
    .refine(val => !val.includes(" "), {
      error: "O valor não pode conter espaços."
    })
    .refine(val => /^\d+(\.00|\.0|\.\d{2})?$/.test(val), {
      error: "O valor precisa numérico com duas casas decimais.",
    })
    .transform(val => Number.parseFloat(val))
    .refine(val => val >= 1, {
      error: "O valor mínimo para transferências é 1.00",
    })
  ,
  accountPassword: z
    .string()
    .length(4, "Senha da conta inválida.")
    .nonempty("A senha de conta é obrigatória.")
    .regex(/^[0-9]+$/, "Senha da conta inválida."),
});

export const resetUserSchema = z.object({
  currentUsername: z
    .string()
    .min(3)
    .max(20)
    .nonempty("Nome de Usuário é obrigatório.")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Dados inválidos."
    ), 
  answer: z
    .string()
    .max(100)
    .nonempty("A resposta secreta é obrigatória."),
  newPassword: z
    .string()
    .min(4, "A senha deve ter no mínimo 4 dígitos.")
    .max(8, "A senha deve ter no máximo 8 dígitos.")
    .nonempty("Uma nova senha deve ser fornecida.")
    .regex(/^[0-9]+$/, "A senha deve conter apenas números."),
});