import { z } from 'zod';
import { prismaImport } from "../../model/db.js";

import {
  createUserSchema,
} from "../../model/validateSchema.js";

import newUser from "../../model/newUser.js";

class UsersController {
  async createUser(req, res) {
    try {
      const newData = req.body;
      const validatedNewData = createUserSchema.safeParse(newData);
      if (!validatedNewData.success) {
        const pretty = z.prettifyError(validatedNewData.error);
        throw new Error(pretty);
      }
      const createdUser = await newUser(newData);
      res.status(201).json(createdUser);
    } catch (erro) {
      if (erro instanceof prismaImport.PrismaClientKnownRequestError) {
        if (erro.code === "P2002") {
          return res
            .status(422)
            .json({ Erro: "Você não pode usar esse username, escolha outro." });
        }
        return res
          .status(422)
          .json({ Erro: "Falha ao cadastrar, tente novamente." });
      }
      res.status(422).json({ Erro: erro.message });
    }
  }
}

export default UsersController