import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  });

  const res = await client.execute("SELECT * FROM oauth_clients LIMIT 2");
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
}
main();
