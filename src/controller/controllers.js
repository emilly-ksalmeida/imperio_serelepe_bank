import list from "../model/listUsers.js";
import newUser from "../model/newUser.js";
import transfer from "../model/transfers.js";

export async function listAllUsers(req, res){
    try {
        const data = await list(); 
        res.json(data);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}
export async function createUser(req, res) {
    try {
        const newData = req.body;
        const createdUser = await newUser(newData);
        res.status(200).json(createdUser);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}
export async function makeTransfer(req, res){
    try {
        const data = req.body;
        const result = await transfer(data);
        res.status(200).json(result);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro": erro.message});
    }
}
