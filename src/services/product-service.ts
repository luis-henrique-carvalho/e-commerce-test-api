import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { BackendError } from "@/utils/errors";

export class ProductService {
  public async getProductById(id: number) {
    const result = await db.select().from(products).where(eq(products.id, id));

    if (result.length === 0)
      throw new BackendError("NOT_FOUND", { message: "Product not found" });

    return result[0];
  }

  public async getAllProducts() {
    return await db.select().from(products);
  }
}

export const productService = new ProductService();
