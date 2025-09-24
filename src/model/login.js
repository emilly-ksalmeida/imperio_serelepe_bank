import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import prisma from "../model/db.js";

export default async function login(req, res) {
    try{
        const {username, password} = req.body;
        if(!username || !password){
            throw new Error("Nome de usuário ou senha inválidos!");
        }
        const user = await prisma.users.findUnique({
            where: {
                username: username
            }
        });
        if(!user){
            throw new Error("Nome de usuário ou senha inválidos!");
        }
        const checkPassword = await bcryptjs.compare(password, user.passwordHash);
        if(!checkPassword){
            throw new Error("Nome de usuário ou senha inválidos!");
        }
        const userAccountId = await prisma.account.findUnique({
            where: {idUser: user.id},
            select: {id: true}
        });
        
        const token = jwt.sign({id: user.id, username: user.username, name: user.name, userAccountId: userAccountId}, process.env.SECRET_KEY, {expiresIn: process.env.TOKEN_EXP});
        res.send(`Olá ${user.name}, login feito com sucesso. Seu token: ${token}`);

    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição, dados inválidos"});
    }
}