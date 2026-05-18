import { AppError } from "../app.error.js";

export class NotFoundError extends AppError {
  constructor(message = "Produto não encontrado") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
