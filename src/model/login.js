import bcryptjs from "bcryptjs";
import prisma from "../model/db.js";

export default async function fazerLogin(req, res) {
    try{
        const {email, senha} = req.body;
        if(!email || !senha){
            throw new Error("e-mail ou senha inválidos!");
        }
        const usuario = await prisma.usuarios.findUnique({
            where: {
                email: email
            }
        });
        if(!usuario){
            throw new Error("O usuario não existe!");
        }
        const verificacaoSenha = await bcryptjs.compare(senha, usuario.senhaHash);
        if(!verificacaoSenha){
            throw new Error("Senha de login incorreta!!");
        }
        res.send(`Olá ${usuario.nome}, login feito com sucesso.`);

    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição, dados inválidos"});
    }
}