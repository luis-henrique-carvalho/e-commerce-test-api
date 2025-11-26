import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductService } from "./product-service";
import { BackendError } from "@/utils/errors";
import { db } from "@/db";

vi.mock("@/db", () => {
  return {
    db: {
      select: vi.fn(),
    },
  };
});

describe("ProductService", () => {
  let service: ProductService;

  const mockWhere = vi.fn();
  const mockFrom = vi.fn();

  const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

  beforeEach(() => {
    service = new ProductService();
    vi.clearAllMocks();

    (db.select as any).mockImplementation(mockSelect);
  });

  describe("getAllProducts", () => {
    it("should return a list of products", async () => {
      const mockProducts = [
        { id: 1, name: "Product 1", priceInCents: 1000 },
        { id: 2, name: "Product 2", priceInCents: 2000 },
      ];

      mockFrom.mockResolvedValue(mockProducts);

      const result = await service.getAllProducts();

      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(2);
    });

    it("should return an empty array if no products found", async () => {
      mockFrom.mockResolvedValue([]);

      const result = await service.getAllProducts();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe("getProductById", () => {
    it("should return the product when found", async () => {
      const mockProduct = { id: 1, name: "Test Product", priceInCents: 500 };

      mockFrom.mockReturnValue({ where: mockWhere });

      mockWhere.mockResolvedValue([mockProduct]);

      const result = await service.getProductById(1);

      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalled();

      expect(result).toEqual(mockProduct);
    });

    it("should throw BackendError if product is not found", async () => {
      mockFrom.mockReturnValue({ where: mockWhere });

      mockWhere.mockResolvedValue([]);

      await expect(service.getProductById(999)).rejects.toThrow(BackendError);

      await expect(service.getProductById(999)).rejects.toThrow(
        "Product not found"
      );
    });
  });
});
