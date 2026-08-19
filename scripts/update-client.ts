import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  });

  await client.execute({
    sql: `UPDATE oauth_clients SET created_at = unixepoch() * 1000, updated_at = unixepoch() * 1000 WHERE client_id = 'blog-prohor-dev'`,
    args: []
  });

  console.log("Updated OAuth Client timestamps.");
  process.exit(0);
}
main();
