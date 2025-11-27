import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export async function setup() {
  const dbUrl = process.env.DB_URL;
  if (!dbUrl) {
    console.warn("DB_URL not set in .env.test, skipping DB creation");
    return;
  }

  try {
    const urlParts = new URL(dbUrl);
    const dbName = urlParts.pathname.slice(1);
    // Connect to default 'postgres' database to create the test database
    const adminUrl = dbUrl.replace(`/${dbName}`, "/postgres");

    const sql = postgres(adminUrl);

    try {
      const dbs =
        await sql`SELECT datname FROM pg_database WHERE datname = ${dbName}`;
      if (dbs.length === 0) {
        console.log(`Creating test database: ${dbName}`);
        await sql`CREATE DATABASE ${sql(dbName)}`;
      }
    } catch (e) {
      console.error("Failed to create test database:", e);
    } finally {
      await sql.end();
    }

    // Run migrations
    const migrationClient = postgres(dbUrl, { max: 1 });
    const db = drizzle(migrationClient);
    try {
      console.log("Running migrations...");
      await migrate(db, { migrationsFolder: "drizzle" });
    } catch (e) {
      console.error("Failed to run migrations:", e);
    } finally {
      await migrationClient.end();
    }
  } catch (e) {
    console.error("Invalid DB_URL:", e);
  }
}
