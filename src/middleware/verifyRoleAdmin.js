import { ForbiddenError } from "../errors/forbidden.error.js";

const verifyRoleAdmin = (req, res, next) => {
  const { role } = req.dataCurrentUser;

  if (role === "admin") {
    next();
  } else {
    throw new ForbiddenError();
  }
};

export default verifyRoleAdmin;
