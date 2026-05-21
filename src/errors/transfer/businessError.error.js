import { AppError } from "../app.error.js";

export class BusinessError extends AppError {
  constructor(message = "Operação não permitida") {
    super(message, 422);
    this.name = "BusinessError";
  }
}
