const verifyRole = (req, res, next) => {
    const { role } = req.dataCurrentUser;
    if(role === "seller"){
        next();
    } else {
        res.status(403).json({ error: "Acesso negado" });
    }
}

export default verifyRole;
