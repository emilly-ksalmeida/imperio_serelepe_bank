import ProductsStockRepository from "../../repositories/productsStock.repository.js";
import { ProductPriceChangedError } from "../../errors/products/productPriceChangedError.error.js";

export class ProductsStockValidatorService {
  constructor(productsStockRepository = new ProductsStockRepository()) {
    this.productsStockRepository = productsStockRepository;
  }

  async execute(productsDataList) {
    const validProducts = [];
    const errors = [];

    for (let product of productsDataList) {
      const validatedProduct = await this.productsStockRepository.findOneById(
        product.productId,
      );

      if (!validatedProduct) {
        errors.push({
          success: false,
          code: "PRODUCT_NOT_FOUND",
          message: "Produto não encontrado",
          details: {
            id: product.productId,
          },
        });
        continue;
      }

      if (!validatedProduct.unitPrice.equals(product.unitPriceOrdered)) {
        throw new ProductPriceChangedError();
      }

      if (validatedProduct.stockQuantity < product.quantity) {
        errors.push({
          success: false,
          code: "INSUFFICIENT_STOCK",
          message: "Estoque insuficiente",
          details: {
            id: validatedProduct.id,
            name: validatedProduct.name,
            quantity: product.quantity,
            availableQuantity: validatedProduct.stockQuantity,
          },
        });
        continue;
      }

      validProducts.push({
        success: true,
        code: "PRODUCT_AVAILABLE",
        message: "Produto disponível em estoque",
        details: {
          id: validatedProduct.id,
          name: validatedProduct.name,
          quantity: product.quantity,
          availableQuantity: validatedProduct.stockQuantity,
          unitPriceOrdered: product.unitPriceOrdered,
          sellerId: validatedProduct.sellerId,
          sellerAccountId: validatedProduct.seller.account.id,
        },
      });
    }

    const hasError = errors.length > 0;

    if (hasError) return errors;

    return validProducts;
  }
}

export default ProductsStockValidatorService;
