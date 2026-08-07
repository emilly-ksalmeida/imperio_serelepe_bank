import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { ProductsStockValidatorService } from "../../src/services/products/productsStockValidator.service.js";
import { ProductPriceChangedError } from "../../src/errors/products/productPriceChangedError.error.js";

describe("ProductsStockValidatorService", () => {
  let mockRepository;
  let service;

  const productData = {
    productId: "prod-1",
    unitPriceOrdered: 1000,
    quantity: 5,
  };

  const productFromDb = {
    id: "prod-1",
    name: "Produto Teste",
    unitPrice: { equals: (val) => val === 1000 },
    stockQuantity: 10,
    sellerId: "seller-1",
    seller: {
      account: {
        id: "acc-seller-1",
      },
    },
  };

  beforeEach(() => {
    mockRepository = { findOneById: jest.fn() };
    service = new ProductsStockValidatorService(mockRepository);
  });

  describe("execute()", () => {
    it("retorna array vazio quando a lista de produtos é vazia", async () => {
      const result = await service.execute([]);

      expect(result).toEqual([]);
      expect(mockRepository.findOneById).not.toHaveBeenCalled();
    });

    it("lança ProductPriceChangedError quando o preço de um produto é alterado", async () => {
      mockRepository.findOneById.mockResolvedValue(productFromDb);
      const alteredPriceData = { ...productData, unitPriceOrdered: 999 };

      await expect(service.execute([alteredPriceData])).rejects.toThrow(
        ProductPriceChangedError,
      );
    });

    it("retorna erros quando há estoque insuficiente", async () => {
      mockRepository.findOneById.mockResolvedValue(productFromDb);
      const insufficientStockData = { ...productData, quantity: 15 };

      const result = await service.execute([insufficientStockData]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        success: false,
        code: "INSUFFICIENT_STOCK",
      });
    });

    it("retorna produtos válidos quando todos os produtos são válidos", async () => {
      mockRepository.findOneById.mockResolvedValue(productFromDb);

      const result = await service.execute([productData]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        success: true,
        code: "PRODUCT_AVAILABLE",
      });
    });

    it("retorna apenas erros em cenário misto (não mistura sucessos com erros)", async () => {
      mockRepository.findOneById
        .mockResolvedValueOnce(productFromDb)
        .mockResolvedValueOnce({ ...productFromDb, id: "prod-2", stockQuantity: 1 });

      const validProduct = { productId: "prod-1", unitPriceOrdered: 1000, quantity: 2 };
      const invalidProduct = { productId: "prod-2", unitPriceOrdered: 1000, quantity: 5 };

      const result = await service.execute([validProduct, invalidProduct]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        success: false,
        code: "INSUFFICIENT_STOCK",
      });
    });

    it("retorna erros quando um produto não é encontrado", async () => {
      mockRepository.findOneById.mockResolvedValue(null);

      const result = await service.execute([productData]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        success: false,
        code: "PRODUCT_NOT_FOUND",
      });
    });
  });
});
