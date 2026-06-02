import ProductsStockRepository from "../../repositories/productsStock.repository.js";
import { ProductPriceChangedError } from "../../errors/products/productPriceChangedError.error.js";

export class ProductsStockValidatorService {
  constructor(productsStockRepository = new ProductsStockRepository()) {
    this.productsStockRepository = productsStockRepository;

    this.validProducts = [];
    this.errors = [];
  }

  async execute(productsDataList) {
    for (let product of productsDataList) {
      await this.validateStockAndPrice(product);
    }

    const hasError = this.errors.length > 0;

    if (hasError) return this.errors;

    return this.validProducts;
  }

  async validateStockAndPrice(productData) {
    const product = await this.productsStockRepository.findOneById(
      productData.productId,
    );

    if (!product) {
      return this.errors.push({
        success: false,
        code: "PRODUCT_NOT_FOUND",
        message: "Produto não encontrado",
        details: {
          id: productData.id,
        },
      });
    }

    if (!product.unitPrice.equals(productData.unitPriceOrdered)) {
      throw new ProductPriceChangedError();
    }

    if (productData.quantity > product.stockQuantity) {
      return this.errors.push({
        success: false,
        code: "INSUFFICIENT_STOCK",
        message: "Estoque insuficiente",
        details: {
          id: product.id,
          name: product.name,
          quantity: productData.quantity,
          availableQuantity: product.stockQuantity,
        },
      });
    }

    return this.validProducts.push({
      success: true,
      code: "PRODUCT_AVAILABLE",
      message: "Produto disponível em estoque",
      details: {
        id: product.id,
        name: product.name,
        quantity: productData.quantity,
        availableQuantity: product.stockQuantity,
        unitPriceOrdered:productData.unitPriceOrdered,
        sellerId: product.sellerId,
      },
    });
  }
}

export default ProductsStockValidatorService;
