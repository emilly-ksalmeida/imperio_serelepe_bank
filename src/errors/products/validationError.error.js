import { AppError } from "../app.error.js";

export class ValidationError extends AppError {
  constructor(message = "Dados fora do padrão") {
    super(message, 422);
    this.name = "ValidationError";
  }
}
