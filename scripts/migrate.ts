import { createClient } from "@libsql/client";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "../src/db/schema";

config({ path: ".env.local" });

console.log("Running migrations...");
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

const client = createClient({
  url,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

await migrate(db, { migrationsFolder: "./src/db/migrations" });
console.log("Migrations completed.");
process.exit(0);
