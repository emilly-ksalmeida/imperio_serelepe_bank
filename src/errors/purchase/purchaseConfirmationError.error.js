import { AppError } from "../app.error.js";

export class PurchaseConfirmationError extends AppError {
  constructor(purchaseValidation) {
    super("Não é possível finalizar a compra", 422);
    this.name = "PurchaseConfirmationError";
    this.reason = purchaseValidation;
  }
}
