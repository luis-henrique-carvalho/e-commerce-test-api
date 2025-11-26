import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductService } from "./product-service";
import { db } from "@/db";
import { products } from "@/db/schema";
import { BackendError } from "@/utils/errors";

// Mock the database
vi.mock("@/db", () => {
  return {
    db: {
      select: vi.fn(),
    },
  };
});

describe("ProductService", () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
    vi.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("should return all products", async () => {
      const mockProducts = [
        { id: 1, name: "Product 1", priceInCents: 1000 },
        { id: 2, name: "Product 2", priceInCents: 2000 },
      ];

      const fromMock = vi.fn().mockResolvedValue(mockProducts);
      (db.select as any).mockReturnValue({
        from: fromMock,
      });

      const result = await productService.getAllProducts();

      expect(db.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalledWith(products);
      expect(result).toEqual(mockProducts);
    });
  });

  describe("getProductById", () => {
    it("should return a product when found", async () => {
      const mockProduct = { id: 1, name: "Product 1", priceInCents: 1000 };

      const whereMock = vi.fn().mockResolvedValue([mockProduct]);
      const fromMock = vi.fn().mockReturnValue({
        where: whereMock,
      });
      (db.select as any).mockReturnValue({
        from: fromMock,
      });

      const result = await productService.getProductById(1);

      expect(db.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalledWith(products);
      expect(whereMock).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it("should throw BackendError when product not found", async () => {
      const whereMock = vi.fn().mockResolvedValue([]);
      const fromMock = vi.fn().mockReturnValue({
        where: whereMock,
      });
      (db.select as any).mockReturnValue({
        from: fromMock,
      });

      await expect(productService.getProductById(999)).rejects.toThrow(
        BackendError
      );
      await expect(productService.getProductById(999)).rejects.toThrow(
        "Product not found"
      );
    });
  });
});
