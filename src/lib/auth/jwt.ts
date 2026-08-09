import "server-only";
import { importPKCS8, importSPKI, jwtVerify, SignJWT } from "jose";

const ISSUER = process.env.NEXT_PUBLIC_APP_URL ?? "https://accounts.prohor.dev";
const ALGORITHM = "RS256";

// ─── JWKS Key Management ──────────────────────────────────────────────────────
// In production, PROHOR_PRIVATE_KEY and PROHOR_PUBLIC_KEY should be env vars.
// In development, if not set, we will use a fallback (not for production).

let privateKeyCache: CryptoKey | null = null;
let publicKeyCache: CryptoKey | null = null;

async function getPrivateKey(): Promise<CryptoKey> {
  if (privateKeyCache) return privateKeyCache;

  const pem = process.env.PROHOR_PRIVATE_KEY;
  if (!pem) {
    throw new Error(
      "PROHOR_PRIVATE_KEY environment variable is not set. Run `bun run generate-keys` to create keys.",
    );
  }
  privateKeyCache = await importPKCS8(pem, ALGORITHM);
  return privateKeyCache;
}

async function getPublicKey(): Promise<CryptoKey> {
  if (publicKeyCache) return publicKeyCache;

  const pem = process.env.PROHOR_PUBLIC_KEY;
  if (!pem) {
    throw new Error("PROHOR_PUBLIC_KEY environment variable is not set.");
  }
  publicKeyCache = await importSPKI(pem, ALGORITHM);
  return publicKeyCache;
}

// ─── ID Token (OIDC) ──────────────────────────────────────────────────────────

export interface OidcIdTokenClaims {
  sub: string; // user ID
  email: string;
  name: string;
  picture?: string;
  aud: string; // client_id of requesting app
}

export async function signIdToken(claims: OidcIdTokenClaims): Promise<string> {
  const privateKey = await getPrivateKey();

  return new SignJWT({
    email: claims.email,
    name: claims.name,
    picture: claims.picture,
  })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(claims.aud)
    .setSubject(claims.sub)
    .setExpirationTime("1h")
    .sign(privateKey);
}

// ─── Access Token ─────────────────────────────────────────────────────────────

export async function signAccessToken(params: {
  sub: string;
  clientId: string;
  scope: string;
}): Promise<string> {
  const privateKey = await getPrivateKey();

  return new SignJWT({ scope: params.scope })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(params.clientId)
    .setSubject(params.sub)
    .setExpirationTime("1h")
    .sign(privateKey);
}

// ─── JWKS Public Keys Endpoint Data ──────────────────────────────────────────

export async function getPublicKeyJwks(): Promise<object> {
  const publicKey = await getPublicKey();
  // Export JWK format using Web Crypto
  const jwk = await crypto.subtle.exportKey("jwk", publicKey);
  return {
    keys: [
      {
        ...jwk,
        use: "sig",
        alg: ALGORITHM,
        kid: "prohor-auth-key-1",
      },
    ],
  };
}

// ─── Verify Access Token ──────────────────────────────────────────────────────

export async function verifyAccessToken(token: string): Promise<{
  sub: string;
  scope: string;
  aud: string;
} | null> {
  try {
    const publicKey = await getPublicKey();
    const { payload } = await jwtVerify(token, publicKey, {
      issuer: ISSUER,
      algorithms: [ALGORITHM],
    });

    return {
      sub: payload.sub as string,
      scope: payload.scope as string,
      aud: Array.isArray(payload.aud)
        ? payload.aud[0]
        : (payload.aud as string),
    };
  } catch {
    return null;
  }
}
