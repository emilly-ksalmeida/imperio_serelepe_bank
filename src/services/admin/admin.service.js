import { AdminRepository } from "../../repositories/admin.repository.js";

export class AdminService {
  constructor(adminRepository = new AdminRepository()) {
    this.adminRepository = adminRepository;
  }

  async getAllUsers() {
    return await this.adminRepository.findAllUsers();
  }
}
