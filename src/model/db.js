import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function listarUsuarios() {
    const user = await prisma.usuarios.findMany();
    return user;
}

export async function criarUsuario(dados) {
    const user = await prisma.usuarios.create({
        data: dados});
    return user;
}
