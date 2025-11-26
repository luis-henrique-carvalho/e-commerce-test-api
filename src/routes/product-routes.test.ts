import request from "supertest";
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import app from "@/server";
import { setupTestDb, clearTestDb, seedProducts } from "@/tests/helpers/db";

describe("Product Routes", () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterEach(async () => {
    await clearTestDb();
  });

  describe("GET /api/products", () => {
    it("should return empty list when no products", async () => {
      const res = await request(app).get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it("should return products when they exist", async () => {
      await seedProducts();
      const res = await request(app).get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0]).toHaveProperty("name", "Test Product 1");
    });
  });

  describe("GET /api/products/:id", () => {
    it("should return product by id", async () => {
      await seedProducts();

      const res = await request(app).get("/api/products/1");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("id", 1);
    });

    it("should return 404 if product not found", async () => {
      const res = await request(app).get("/api/products/999");
      expect(res.status).toBe(404);
    });
  });
});
