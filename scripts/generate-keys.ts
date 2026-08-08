import { exportPKCS8, exportSPKI, generateKeyPair } from "jose";

console.log("Generating RS256 key pair for Prohor Auth OIDC...\n");

const { privateKey, publicKey } = await generateKeyPair("RS256", {
  modulusLength: 2048,
  extractable: true,
});

const privateKeyPem = await exportPKCS8(privateKey);
const publicKeyPem = await exportSPKI(publicKey);

console.log("=== PRIVATE KEY (add to PROHOR_PRIVATE_KEY in .env.local) ===");
console.log(privateKeyPem);
console.log("=== PUBLIC KEY (add to PROHOR_PUBLIC_KEY in .env.local) ===");
console.log(publicKeyPem);
