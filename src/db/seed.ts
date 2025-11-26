import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { products, cartItems, carts } from "./schema";
import { env } from "@/utils/env";

const client = postgres(env.DB_URL);
const db = drizzle(client);

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    console.log("🗑️  Clearing existing data...");
    await db.delete(cartItems);
    await db.delete(carts);
    await db.delete(products);
    console.log("✅ Existing data cleared");

    console.log("📦 Inserting products...");
    const insertedProducts = await db
      .insert(products)
      .values([
        {
          name: "Smartphone Samsung Galaxy S24",
          description:
            "Smartphone top de linha com câmera de 200MP, processador Snapdragon 8 Gen 3, 12GB RAM e 256GB de armazenamento interno.",
          imageUrl:
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
          priceInCents: 449900,
        },
        {
          name: "Notebook Gamer Acer Nitro 5",
          description:
            "Notebook gamer potente equipado com processador Intel Core i7 de 12ª geração, placa de vídeo NVIDIA GeForce RTX 4060, 16GB de RAM DDR5, SSD NVMe de 512GB, tela Full HD de 15.6 polegadas com taxa de atualização de 144Hz, teclado retroiluminado RGB, sistema de refrigeração avançado com dual-fan cooling, conexões USB-C, HDMI 2.1, e Wi-Fi 6E para máxima performance em jogos e aplicações pesadas.",
          imageUrl:
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
          priceInCents: 749900,
          promotionalPriceInCents: 649900,
        },
        {
          name: "Mouse Gamer Logitech G Pro",
          description:
            "Mouse gamer profissional com sensor HERO 25K, 8 botões programáveis e design ambidestro.",
          imageUrl:
            "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
          priceInCents: 29900,
          promotionalPriceInCents: 24900,
        },
        {
          name: "Teclado Mecânico Keychron K2",
          description:
            "Teclado mecânico wireless com switches Gateron, layout 75%, conexão Bluetooth e USB-C.",
          imageUrl:
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
          priceInCents: 59900,
        },
        {
          name: "Fone de Ouvido Sony WH-1000XM5",
          description:
            "Fone de ouvido premium com cancelamento de ruído inteligente, bateria de 30 horas e som Hi-Res.",
          imageUrl:
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800",
          priceInCents: 189900,
        },
      ])
      .returning();

    console.log(`✅ Inserted ${insertedProducts.length} products`);

    console.log("🎉 Database seed completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await client.end();
    console.log("🔌 Database connection closed");
  }
}

seed();
