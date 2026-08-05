import { AppError } from "../app.error.js";

export class InvalidSecurityAnswerError extends AppError {
  constructor(message = "Resposta de segurança inválida") {
    super(message, 401);
    this.name = "InvalidSecurityAnswerError";
  }
}
