import { ForbiddenError } from "../errors/forbidden.error.js";

const verifyRole = (rolesPermitidas = []) => {
  return (req, res, next) => {
    const { role } = req.dataCurrentUser;

    if (rolesPermitidas.includes(role)) {
      next();
    } else {
      throw new ForbiddenError();
    }
  };
};

export default verifyRole;
