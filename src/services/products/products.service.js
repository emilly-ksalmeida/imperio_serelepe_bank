import { NotFoundError } from "../../errors/notFoundError.error.js";
import ProductsRepository from "../../repositories/products.repository.js";

export class ProductsService {
  constructor(productRepository = new ProductsRepository()) {
    this.productRepository = productRepository;
  }

  async getAllProducts() {
    return await this.productRepository.findAllProducts();
  }

  async getProductsBySeller(sellerId) {
    const productsList =  await this.productRepository.findBySellerId(sellerId);
    return productsList;
  }

  async newProduct(productData) {
   const { sellerId, name, description, unitPrice, stockQuantity } =
      productData;

    return await this.productRepository.createProduct(
      sellerId,
      name,
      description,
      unitPrice,
      stockQuantity
    );
  }

  async updateProduct(productId, currentUserId, updateData) {
      const { name, description, unitPrice, stockQuantity } = updateData;
      const isActive = stockQuantity > 0 ? true : false;
      const productIdParsed = parseInt(productId);

      const product = await this.productRepository.updateByIdAndSeller(
        productIdParsed,
        currentUserId,
        { name, description, unitPrice, stockQuantity, isActive },
      );
      return product;
  }

  async deleteProduct(productId, currentUserId) {
    const productIdParsed = parseInt(productId);

    return await this.productRepository.deleteByIdAndSeller(productIdParsed, currentUserId);
  }
}

export default ProductsService;
