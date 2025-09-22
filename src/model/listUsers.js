import prisma from "./db.js";

export default async function list() {
    const allUsers = await prisma.users.findMany();
    return allUsers;
}




