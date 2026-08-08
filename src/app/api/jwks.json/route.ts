import { NextResponse } from "next/server";
import { getPublicKeyJwks } from "@/lib/auth/jwt";

// GET /api/jwks.json
// Exposes the RS256 public key set so third-party apps can verify Prohor JWTs
export async function GET() {
  const jwks = await getPublicKeyJwks();

  return NextResponse.json(jwks, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json",
    },
  });
}
