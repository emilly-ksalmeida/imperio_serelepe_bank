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
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}
export async function generateAccountStatement(userId){
    try {
        const accountId = await prisma.account.findUnique({
            where: {idUser: userId},
            select:{id: true}
        });
        const statement = await prisma.transfers.findMany({
            where: {
                OR: [{fromId: accountId.id}, {toId: accountId.id} ]
            },
            orderBy: [{createdAt: 'desc'}]
        });
        return statement;
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}
