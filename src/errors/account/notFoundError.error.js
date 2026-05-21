import { AppError } from "../app.error.js";

export class NotFoundError extends AppError {
  constructor(message = "Conta não encontrada") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
