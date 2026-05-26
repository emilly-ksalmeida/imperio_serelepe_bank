import { AppError } from "../app.error.js";

export class ProductPriceChangedError extends AppError {
  constructor(message = "O preço do produto foi alterado") {
    super(message, 409);
    this.name = "ProductPriceChangedError";
  }
}
