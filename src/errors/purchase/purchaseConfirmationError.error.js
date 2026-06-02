import { AppError } from "../app.error.js";

export class PurchaseConfirmationError extends AppError {
  constructor(purchaseValidation) {
    super("Não é possível finalizar a compra, produto não encontrado ou estoque insuficiente", 409);
    this.validationErrors = purchaseValidation;
  }
}
