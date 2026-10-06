import bcryptjs from "bcryptjs";
import { AdminRepository } from "../../repositories/admin.repository.js";

export class AdminService {
  constructor(adminRepository = new AdminRepository()) {
    this.adminRepository = adminRepository;
  }

  async getAllUsers() {
    return await this.adminRepository.findAllUsers();
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
