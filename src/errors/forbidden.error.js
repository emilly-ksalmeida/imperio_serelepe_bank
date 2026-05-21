import { AppError } from "./app.error.js";

export class ForbiddenError extends AppError {
  constructor(message = "Você não possui permissão para acessar este recurso") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}
