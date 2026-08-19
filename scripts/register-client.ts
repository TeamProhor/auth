import { createClient } from "@libsql/client";
import { randomBytes, createHash } from "node:crypto";

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  });

  const res = await client.execute("SELECT id FROM users LIMIT 1");
  const adminId = res.rows[0]?.id;

  if (!adminId) {
    console.log("No users found");
    process.exit(1);
  }

  const clientId = "blog-prohor-dev";
  const clientSecret = "super-secret-blog-key";
  const clientSecretHash = createHash("sha256").update(clientSecret).digest("hex");

  await client.execute({
    sql: `
      INSERT INTO oauth_clients (id, owner_id, client_id, client_secret_hash, name, description, app_type, redirect_uris, logo_url, is_active, created_at, updated_at, created_by_user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, 1, unixepoch(), unixepoch(), ?)
      ON CONFLICT(client_id) DO UPDATE SET redirect_uris = ?
    `,
    args: [
      randomBytes(16).toString("hex"),
      adminId,
      clientId,
      clientSecretHash,
      "Prohor Blog",
      "The main publication platform",
      "web",
      JSON.stringify(["http://localhost:3000/api/auth/callback", "https://blog.prohor.dev/api/auth/callback"]),
      adminId,
      JSON.stringify(["http://localhost:3000/api/auth/callback", "https://blog.prohor.dev/api/auth/callback"])
    ]
  });

  console.log(`✅ Registered Blog OAuth Client!`);
  console.log(`CLIENT_ID=${clientId}`);
  console.log(`CLIENT_SECRET=${clientSecret}`);
  process.exit(0);
}

main();
