import { list, getBalanceById, generateAccountStatement } from "../model/listUsers.js";
import newUser from "../model/newUser.js";
import transfer from "../model/transfers.js";
import { createUserSchema, transferSchema } from "../model/validateSchema.js";

export async function listAllUsers(req, res){
    try {
        const data = await list(); 
        res.status(200).json(data);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

export async function createUser(req, res) {
    try {
        const newData = req.body;
        const validatedNewData = createUserSchema.safeParse(newData);
        if(!validatedNewData.success){
            throw new Error(validatedNewData.error);
        }
        const createdUser = await newUser(newData);
        res.status(201).json(createdUser);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}
export async function makeTransfer(req, res){
    try {
        const data = req.body;
        const validatedData = transferSchema.safeParse(data);
        console.log(validatedData);
        const { userAccountId } = req.dataCurrentUser;
        const atualizedData = {
            userAccountId: userAccountId.id,
            ...data
        };
        const result = await transfer(atualizedData);
        res.status(201).json(result);
    } catch(erro){
        console.error(erro);
        res.status(500).json({"Erro": erro.message});
    }
}
export async function getBalance(req, res){
    try {
        const accountId = req.dataCurrentUser.userAccountId.id;
        const result = await getBalanceById(accountId);
        res.status(200).json(result);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}
export async function getStatement(req, res){
    try {
        const accountId = req.dataCurrentUser.userAccountId.id;
        const result = await generateAccountStatement(accountId);
        res.status(200).json(result);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}