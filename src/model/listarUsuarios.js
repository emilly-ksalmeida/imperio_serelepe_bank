import prisma from "../model/db.js";

export default async function listarUsuarios() {
    const user = await prisma.usuarios.findMany();
    return user;
}




