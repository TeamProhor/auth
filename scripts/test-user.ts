import { getCurrentUser } from "../src/lib/auth/session";

async function main() {
  try {
    const user = await getCurrentUser();
    console.log("Current User:", user);
  } catch (err) {
    console.error("getCurrentUser Error:", err);
  }
  process.exit(0);
}
main();
