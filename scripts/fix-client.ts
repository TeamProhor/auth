import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  });

  await client.execute({
    sql: `UPDATE oauth_clients SET logo_url = 'https://blog.prohor.dev/app.png' WHERE client_id = 'blog-prohor-dev'`,
    args: []
  });

  console.log("Updated OAuth Client logo_url.");
  process.exit(0);
}
main();
