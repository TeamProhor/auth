import { createClient } from "@libsql/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

const client = createClient({
  url,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function main() {
  console.log("Creating verification and two_factor tables if not exists...");
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS verification (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS two_factor (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      secret TEXT NOT NULL,
      backup_codes TEXT NOT NULL
    );
  `);

  console.log("Tables created successfully!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
