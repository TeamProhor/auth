import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Lazily initialized to avoid throwing at build time when DATABASE_URL is not set.
// Will throw at request time if missing, which is the correct behavior.
function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  const client = postgres(connectionString, { prepare: false });
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
