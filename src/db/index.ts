import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Lazily initialized to avoid throwing at build time when DATABASE_URL is not set.
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  const client = createClient({
    url,
    authToken,
  });
  return drizzle(client, { schema });
}

let _db: ReturnType<typeof createDb> | null = null;

function getDb() {
  if (!_db) _db = createDb();
  return _db;
}

// Use a Proxy to defer initialization until the first property access
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, prop) {
    return Reflect.get(getDb(), prop);
  },
});
