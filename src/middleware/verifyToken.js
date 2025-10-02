import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) =>{
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if(!token) return res.status(403).json({"message": "Token não fornecido."});

    jwt.verify(token, process.env.SECRET_KEY, (err, dataCurrentUser)=>{
        if(err) return res.status(403).json({"message": "Token inválido."});
        req.dataCurrentUser = dataCurrentUser;
        next();
    })
}
export default verifyToken;