import { db } from "../src/db";
import { oauthClients } from "../src/db/schema";
import { and, eq } from "drizzle-orm";

async function main() {
  try {
    const client_id = "blog-prohor-dev";
    
    console.log("Querying...");
    const client = await db.query.oauthClients.findFirst({
      where: and(
        eq(oauthClients.clientId, client_id),
        eq(oauthClients.isActive, true),
      ),
    });
    
    console.log("Result:", client);
  } catch (err) {
    console.error("Drizzle Error:", err);
  }
  process.exit(0);
}
main();
