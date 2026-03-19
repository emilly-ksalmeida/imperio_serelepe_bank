const verifyRole = (req, res, next) => {
    const { role } = req.dataCurrentUser;
    
    if(role === "seller"){
        next();
    } else {
        return res.status(403).json({ message: "Acesso negado" });
    }
}

export default verifyRole;
