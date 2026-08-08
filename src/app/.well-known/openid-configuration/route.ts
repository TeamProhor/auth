import { NextResponse } from "next/server";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://accounts.prohor.dev";

// GET /.well-known/openid-configuration
export function GET() {
  return NextResponse.json(
    {
      issuer: APP_URL,
      authorization_endpoint: `${APP_URL}/api/oauth/authorize`,
      token_endpoint: `${APP_URL}/api/oauth/token`,
      userinfo_endpoint: `${APP_URL}/api/oauth/userinfo`,
      jwks_uri: `${APP_URL}/api/jwks.json`,
      scopes_supported: ["openid", "profile", "email", "offline_access"],
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      subject_types_supported: ["public"],
      id_token_signing_alg_values_supported: ["RS256"],
      token_endpoint_auth_methods_supported: ["client_secret_post", "none"],
      code_challenge_methods_supported: ["S256", "plain"],
      claims_supported: [
        "sub",
        "iss",
        "aud",
        "exp",
        "iat",
        "name",
        "email",
        "email_verified",
        "picture",
      ],
    },
    {
      headers: {
        "Cache-Control": "public, max-age=86400",
        "Content-Type": "application/json",
      },
    },
  );
}
