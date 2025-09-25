import { list, getBalanceById, generateAccountStatement } from "../model/listUsers.js";
import newUser from "../model/newUser.js";
import transfer from "../model/transfers.js";

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
        if(!newData.name || !newData.username || !newData.password || !newData.accountPassword) return res.status(400).json({"Erro": "Preencha todos os dados obrigatórios!"});
        if(newData.password.length < 4 || newData.accountPassword.length < 4)return res.status(400).json({"Erro": "As senhas precisão ter no mínimo 4 caracteres!"});
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
        if(!data.toAccountId || !data.value || !data.password) return res.status(400).json({"Erro": "Preencha todos os dados obrigatórios!"});
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
        //const { id } = req.params;
        //const dataUserId = req.dataCurrentUser.id;
        //if(!id || dataUserId !== id) return res.status(400).json({"Erro": "Falha na requisição"});
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
        //const { id } = req.params;
        //const dataUserId = req.dataCurrentUser.id;
        //if(!id || dataUserId !== id) return res.status(400).json({"Erro": "Falha na requisição"});
        const accountId = req.dataCurrentUser.userAccountId.id;
        const result = await generateAccountStatement(accountId);
        res.status(200).json(result);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}