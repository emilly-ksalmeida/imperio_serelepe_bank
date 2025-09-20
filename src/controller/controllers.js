import listarUsuarios from "../model/listarUsuarios.js";
import novoUsuario from "../model/novoUsuario.js";
import transferir from "../model/transferencia.js";

export async function listarTodosUsuarios(req, res){
    try {const dados = await listarUsuarios(); 
        res.json(dados);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}
export async function criarUsuario(req, res) {
    try {
        const novosDados = req.body;
        const usuarioCriado = await novoUsuario(novosDados);
        res.status(200).json(usuarioCriado);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}
export async function fazerTransferencia(req, res){
    try {
        const dados = req.body;
        const resultado = await transferir(dados);
        res.status(200).json(resultado);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro": erro.message});
    }
}