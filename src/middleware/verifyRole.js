import { ForbiddenError } from "../errors/forbidden.error.js";

const verifyRole = (req, res, next) => {
  const { role } = req.dataCurrentUser;

  if (role === "seller") {
    next();
  } else {
    throw new ForbiddenError();
  }
};

export default verifyRole;
