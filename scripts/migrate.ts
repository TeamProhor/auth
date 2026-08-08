import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../src/db";

console.log("Running migrations...");
await migrate(db, { migrationsFolder: "./src/db/migrations" });
console.log("Migrations completed.");
process.exit(0);
