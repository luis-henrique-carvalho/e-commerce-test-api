import request from "supertest";
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import app from "@/server";
import { setupTestDb, clearTestDb, seedProducts } from "@/tests/helpers/db";

describe("Cart Routes", () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterEach(async () => {
    await clearTestDb();
  });

  describe("GET /api/cart", () => {
    it("should return empty cart initially", async () => {
      const res = await request(app).get("/api/cart");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("items", []);
      expect(res.body.data).toHaveProperty("totalInCents", 0);
    });
  });

  describe("POST /api/cart/add", () => {
    it("should add item to cart", async () => {
      await seedProducts();
      const res = await request(app)
        .post("/api/cart/add")
        .send({ productId: 1, quantity: 1 });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("productId", 1);
      expect(res.body.data).toHaveProperty("quantity", 1);
    });

    it("should decrease quantity if negative value is passed", async () => {
      await seedProducts();
      await request(app)
        .post("/api/cart/add")
        .send({ productId: 1, quantity: 2 });

      const res = await request(app)
        .post("/api/cart/add")
        .send({ productId: 1, quantity: -1 });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("quantity", 1);
    });

    it("should remove item if quantity becomes zero or less", async () => {
      await seedProducts();
      await request(app)
        .post("/api/cart/add")
        .send({ productId: 1, quantity: 1 });

      const res = await request(app)
        .post("/api/cart/add")
        .send({ productId: 1, quantity: -1 });

      expect(res.status).toBe(201);

      const cartRes = await request(app).get("/api/cart");
      expect(cartRes.body.data.items).toHaveLength(0);
    });

    it("should return 404 if product not found", async () => {
      const res = await request(app)
        .post("/api/cart/add")
        .send({ productId: 999, quantity: 1 });

      expect(res.status).toBe(404);
    });

    it("should return 400 if adding negative quantity for new item", async () => {
      await seedProducts();
      const res = await request(app)
        .post("/api/cart/add")
        .send({ productId: 1, quantity: -1 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Cannot add negative quantity for new item"
      );
    });

    it("should return 400 if quantity is zero", async () => {
      await seedProducts();
      const res = await request(app)
        .post("/api/cart/add")
        .send({ productId: 1, quantity: 0 });

      expect(res.status).toBe(400);
    });

    it("should validate input", async () => {
      const res = await request(app)
        .post("/api/cart/add")
        .send({ productId: "invalid", quantity: 1 });

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/cart/:id", () => {
    it("should remove item from cart", async () => {
      await seedProducts();

      const addRes = await request(app)
        .post("/api/cart/add")
        .send({ productId: 1, quantity: 1 });

      const itemId = addRes.body.data.id;

      const res = await request(app).delete(`/api/cart/${itemId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Item removed from cart");

      const cartRes = await request(app).get("/api/cart");
      expect(cartRes.body.data.items).toHaveLength(0);
    });

    it("should return 404 if item not found", async () => {
      await request(app).get("/api/cart");

      const res = await request(app).delete("/api/cart/999");
      expect(res.status).toBe(404);
    });
  });
});
