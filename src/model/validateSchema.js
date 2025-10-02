import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(70)
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
    .min(3)
    .max(20)
    .nonempty("Nome de Usuário é obrigatório.")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Username só pode conter letras, números, . ou _, não pode conter espaços."
    ),
  password: z
    .string()
    .min(4)
    .max(8)
    .nonempty("A senha de login é obrigatória.")
    .regex(/^[0-9]+$/, "A senha deve conter apenas números."),
  accountPassword: z
    .string()
    .length(4)
    .nonempty("A senha de conta é obrigatória.")
    .regex(/^[0-9]+$/, "A senha deve conter apenas números."),
});

export const loginSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .nonempty("Nome de Usuário é obrigatório.")
    .regex(/^[a-zA-Z0-9._]+$/, "Username inválido."),
  password: z
    .string()
    .min(4)
    .max(8)
    .nonempty("A senha de login é obrigatória.")
    .regex(/^[0-9]+$/, "Senha inválida."),
});

export const transferSchema = z.object({
  toAccountId: z.string().length(4).nonempty("Nome de Usuário é obrigatório."),
  value: z.preprocess((val) => {
    if (typeof val === "string" && /^\d+(\.00|\.\d{2})?$/.test(val)) {
      return Number.parseFloat(val);
    }
    return val;
  }, z.number("O valor precisa ter duas casas decimais.").gte(0.01, "O valor mínimo é 0.01.")),
  accountPassword: z
    .string()
    .length(4, "Senha da conta inválida.")
    .nonempty("A senha de conta é obrigatória.")
    .regex(/^[0-9]+$/, "Senha da conta inválida."),
});
