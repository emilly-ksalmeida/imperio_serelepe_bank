import bcryptjs from "bcryptjs";
import { AdminRepository } from "../../repositories/admin.repository.js";
import ProductsService from "../products/products.service.js";

export class AdminService {
  constructor(
    adminRepository = new AdminRepository(),
    productsService = new ProductsService(),
  ) {
    this.adminRepository = adminRepository;
    this.productsService = productsService;
  }

  async getAllUsers() {
    return await this.adminRepository.findAllUsers();
  }

  async getSellers() {
    return await this.adminRepository.findAllSellers();
  }

  async getProductsBySeller(sellerId) {
    await this.adminRepository.findSellerOrThrow(sellerId);

    return await this.productsService.getProductsBySeller(sellerId);
  }

  async createProduct({ sellerUsername, ...productData }) {
    const seller = await this.adminRepository.findSellerByUsername(
      sellerUsername,
    );

    return await this.productsService.newProduct({
      ...productData,
      sellerId: seller.id,
    });
  }

  async updateProduct(productId, updateData) {
    return await this.productsService.updateProductById(productId, updateData);
  }

  async resetPassword(username, newPassword) {
    const passwordHash = await bcryptjs.hash(newPassword, 10);

    const result = await this.adminRepository.updatePassword(
      username,
      passwordHash,
    );

    return { message: `Senha de ${result.name} alterada com sucesso.` };
  }
}
