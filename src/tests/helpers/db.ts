import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function clearTestDb() {
  await db.execute(
    sql`TRUNCATE TABLE cart_items, carts, products RESTART IDENTITY CASCADE`
  );
}

export async function seedProducts() {
  await db.execute(sql`
    INSERT INTO products (name, description, image_url, price_in_cents)
    VALUES
    ('Test Product 1', 'Description 1', 'http://example.com/1.jpg', 1000),
    ('Test Product 2', 'Description 2', 'http://example.com/2.jpg', 2000)
  `);
}
