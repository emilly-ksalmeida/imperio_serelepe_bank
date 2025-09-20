import express from "express";
import {listarUsuarios, criarUsuario, transferir} from "./src/model/db.js";

const app = express();

 app.use(express.json()); 

app.get("/", async (req, res)=>{
    try {const dados = await listarUsuarios(); 
    res.json(dados);
    }catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
});

app.post("/novo-usuario", async (req, res)=>{
   try {
    const novosDados = req.body;
    
    const usuarioCriado = await criarUsuario(novosDados);
    res.status(200).json(usuarioCriado);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
});

app.post("/fazer-transferencia", async (req, res)=>{
    
    try {
        const dados = req.body;
        const resultado = await transferir(dados);
        res.status(200).json(resultado);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro": erro.message});
    }
});

app.listen(3000, ()=>{
    console.log("Servidor funcionando!!");
});