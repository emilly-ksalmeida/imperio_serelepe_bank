import { AppError } from "../app.error.js";

export class InsufficientProductStockError extends AppError {
  constructor(message = "Estoque insuficiente para o produto") {
    super(message, 409);
    this.name = "InsufficientProductStockError";
  }
}
