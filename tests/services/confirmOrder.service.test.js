import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockCheckPassword = jest.fn();

jest.unstable_mockModule("../../src/utils/check-password.js", () => ({
  default: mockCheckPassword,
}));

const { ConfirmOrderService } = await import(
  "../../src/services/purchase/confirmOrder.service.js"
);
const { BusinessError } = await import(
  "../../src/errors/transfer/businessError.error.js"
);

describe("ConfirmOrderService", () => {
  let mockStockValidator;
  let mockAccountService;
  let mockRepository;
  let service;

  const userFromDb = { passwordHash: "$2a$10$hash" };

  beforeEach(() => {
    mockCheckPassword.mockReset();

    mockStockValidator = { execute: jest.fn() };
    mockAccountService = { getBalanceById: jest.fn() };
    mockRepository = { users: { findUnique: jest.fn() } };

    service = new ConfirmOrderService(
      mockStockValidator,
      mockAccountService,
      mockRepository,
    );
  });

  describe("execute() com validação de estoque", () => {
    it("retorna success false quando a validação de estoque contém erros mistos", async () => {
      mockRepository.users.findUnique.mockResolvedValue(userFromDb);
      mockCheckPassword.mockResolvedValue(true);

      const mixedResult = [
        { success: true, code: "PRODUCT_AVAILABLE" },
        { success: false, code: "PRODUCT_NOT_FOUND", details: { id: "prod-x" } },
        { success: false, code: "INSUFFICIENT_STOCK", details: { id: "prod-y" } },
      ];
      mockStockValidator.execute.mockResolvedValue(mixedResult);

      const payload = {
        userId: "user-1",
        userAccountId: "acc-1",
        password: "1234",
        purchase: [
          { id: "prod-1", quantity: 1, unitPriceOrdered: 100 },
          { id: "prod-x", quantity: 1, unitPriceOrdered: 100 },
          { id: "prod-y", quantity: 99, unitPriceOrdered: 100 },
        ],
      };

      const result = await service.execute(payload);

      expect(result).toEqual({ success: false, details: mixedResult });
      expect(mockAccountService.getBalanceById).not.toHaveBeenCalled();
    });
  });

  describe("#calculateOrderTotal (comportamento observado via execute)", () => {
    it("lança BusinessError com saldo 0 indicando que o total foi calculado", async () => {
      mockRepository.users.findUnique.mockResolvedValue(userFromDb);
      mockCheckPassword.mockResolvedValue(true);
      mockStockValidator.execute.mockResolvedValue([
        { success: true, code: "PRODUCT_AVAILABLE" },
      ]);
      mockAccountService.getBalanceById.mockResolvedValue(0);

      const payload = {
        userId: "user-1",
        userAccountId: "acc-1",
        password: "1234",
        purchase: [
          { id: "prod-1", quantity: 2, unitPriceOrdered: 1000 },
          { id: "prod-2", quantity: 3, unitPriceOrdered: 500 },
        ],
      };

      await expect(service.execute(payload)).rejects.toThrow(BusinessError);
    });

    it("lança BusinessError com saldo 3499 confirmando total > 3499", async () => {
      mockRepository.users.findUnique.mockResolvedValue(userFromDb);
      mockCheckPassword.mockResolvedValue(true);
      mockStockValidator.execute.mockResolvedValue([
        { success: true, code: "PRODUCT_AVAILABLE" },
      ]);
      mockAccountService.getBalanceById.mockResolvedValue(3499);

      const payload = {
        userId: "user-1",
        userAccountId: "acc-1",
        password: "1234",
        purchase: [
          { id: "prod-1", quantity: 2, unitPriceOrdered: 1000 },
          { id: "prod-2", quantity: 3, unitPriceOrdered: 500 },
        ],
      };

      await expect(service.execute(payload)).rejects.toThrow(BusinessError);
    });

    it("retorna sucesso com saldo 3500 confirmando total <= 3500", async () => {
      mockRepository.users.findUnique.mockResolvedValue(userFromDb);
      mockCheckPassword.mockResolvedValue(true);
      mockStockValidator.execute.mockResolvedValue([
        { success: true, code: "PRODUCT_AVAILABLE" },
      ]);
      mockAccountService.getBalanceById.mockResolvedValue(3500);

      const payload = {
        userId: "user-1",
        userAccountId: "acc-1",
        password: "1234",
        purchase: [
          { id: "prod-1", quantity: 2, unitPriceOrdered: 1000 },
          { id: "prod-2", quantity: 3, unitPriceOrdered: 500 },
        ],
      };

      const result = await service.execute(payload);

      expect(result).toMatchObject({ success: true });
    });

    it("retorna sucesso com lista vazia e saldo 0 confirmando total = 0", async () => {
      mockRepository.users.findUnique.mockResolvedValue(userFromDb);
      mockCheckPassword.mockResolvedValue(true);
      mockStockValidator.execute.mockResolvedValue([]);
      mockAccountService.getBalanceById.mockResolvedValue(0);

      const payload = {
        userId: "user-1",
        userAccountId: "acc-1",
        password: "1234",
        purchase: [],
      };

      const result = await service.execute(payload);

      expect(result).toMatchObject({ success: true });
    });
  });
});
