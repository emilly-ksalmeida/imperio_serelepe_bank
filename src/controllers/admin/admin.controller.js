import { AdminService } from "../../services/admin/admin.service.js";

export default class AdminController {
  constructor(adminService = new AdminService()) {
    this.adminService = adminService;
  }

  async getAllUsers(req, res, _next) {
    const allUsers = await this.adminService.getAllUsers();
    res.status(200).json(allUsers);
  }
}
