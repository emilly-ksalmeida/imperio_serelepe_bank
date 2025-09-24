import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) =>{
    const token = req.headers["authorization"];
    if(!token) return res.status(403).json({"message": "Token não fornecido."});

    jwt.verify(token, process.env.SECRET_KEY, (err, dataCurrentUser)=>{
        if(err) return res.status(403).json({"message": "Token inválido."});
        req.dataCurrentUser = dataCurrentUser;
        next();
    })
}
export default verifyToken;