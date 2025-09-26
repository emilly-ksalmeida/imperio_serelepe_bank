import { z } from "zod";

const createUserSchema = z.object({
    name: z.string()
    .min(2)
    .max(70)
    .nonempty("Nome é obrigatório")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Nome deve conter apenas letras e espaços")
    .refine(name => name.trim().length > 0, "Nome não pode conter apenas espaços"
  ),
	username: z.string()
    .min(3)
    .max(20)
    .nonempty("Nome de Usuário é obrigatório")
    .regex(/^[a-zA-Z0-9._]+$/, "Username só pode conter letras, números, . ou _"),
	password: z.string()
    .min(4)
    .max(8)
    .nonempty("A senha de login é obrigatória")
    .regex(/^[0-9]+$/, "A senha deve conter apenas números"),
	accountPassword: z.string()
    .length(4)
    .nonempty("A senha de conta é obrigatória")
    .regex(/^[0-9]+$/, "A senha deve conter apenas números")
});
export default createUserSchema;
