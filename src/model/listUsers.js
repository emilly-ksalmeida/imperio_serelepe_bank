import prisma from "./db.js";

export async function list() {
    try {
        const allUsers = await prisma.users.findMany();
        return allUsers;
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}
export async function getBalanceById(id){
    try{
        const userBalance = await prisma.account.findUnique({
            where: {idUser: id},
            select:{balance: true}
        });
        return userBalance;
    }catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}



