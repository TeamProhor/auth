import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  accessTokens,
  authorizationCodes,
  oauthClients,
  refreshTokens,
  users,
} from "@/db/schema";
import { verifyPassword } from "@/lib/auth/crypto";
import { signAccessToken, signIdToken } from "@/lib/auth/jwt";
import { OAuthTokenSchema } from "@/lib/validations";

const _APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://accounts.prohor.dev";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function verifySHA256PKCE(verifier: string, challenge: string): boolean {
  const hash = createHash("sha256").update(verifier).digest("base64url");
  return hash === challenge;
}

// POST /api/oauth/token
export async function POST(request: NextRequest) {
  let body: Record<string, string>;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    body = await request.json();
  } else {
    const form = await request.formData();
    body = Object.fromEntries(
      [...form.entries()].map(([k, v]) => [k, String(v)]),
    );
  }

  const parsed = OAuthTokenSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const data = parsed.data;

  // Validate client
  const client = await db.query.oauthClients.findFirst({
    where: eq(oauthClients.clientId, data.client_id),
  });

  if (!client?.isActive) {
    return NextResponse.json({ error: "invalid_client" }, { status: 401 });
  }

  // Verify client_secret if provided (confidential clients)
  if (
    data.client_secret &&
    client.clientSecretHash &&
    client.appType !== "web"
  ) {
    const valid = await verifyPassword(
      client.clientSecretHash,
      data.client_secret,
    );
    if (!valid) {
      return NextResponse.json({ error: "invalid_client" }, { status: 401 });
    }
  }

  // ─── Authorization Code Grant ─────────────────────────────────────────────

  if (data.grant_type === "authorization_code") {
    if (!data.code || !data.redirect_uri) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const codeHash = createHash("sha256").update(data.code).digest("hex");

    const authCode = await db.query.authorizationCodes.findFirst({
      where: eq(authorizationCodes.codeHash, codeHash),
    });

    if (
      !authCode ||
      authCode.clientId !== data.client_id ||
      authCode.redirectUri !== data.redirect_uri ||
      authCode.expiresAt < new Date()
    ) {
      return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
    }

    // Delete auth code immediately (single use)
    await db
      .delete(authorizationCodes)
      .where(eq(authorizationCodes.codeHash, codeHash));

    // PKCE verification
    if (authCode.codeChallenge) {
      if (!data.code_verifier) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description: "code_verifier required",
          },
          { status: 400 },
        );
      }
      const valid =
        authCode.codeChallengeMethod === "S256"
          ? verifySHA256PKCE(data.code_verifier, authCode.codeChallenge)
          : data.code_verifier === authCode.codeChallenge;

      if (!valid) {
        return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
      }
    }

    // Fetch user info for ID token claims
    const user = await db.query.users.findFirst({
      where: eq(users.id, authCode.userId),
    });

    if (!user) {
      return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
    }

    // Generate tokens
    const rawAccessToken = randomBytes(32).toString("hex");
    const rawRefreshToken = randomBytes(48).toString("hex");

    const accessTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1h
    const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30d

    await db.insert(accessTokens).values({
      tokenHash: hashToken(rawAccessToken),
      clientId: data.client_id,
      userId: authCode.userId,
      scope: authCode.scope,
      expiresAt: accessTokenExpiry,
    });

    await db.insert(refreshTokens).values({
      tokenHash: hashToken(rawRefreshToken),
      clientId: data.client_id,
      userId: authCode.userId,
      scope: authCode.scope,
      expiresAt: refreshTokenExpiry,
    });

    // Sign a JWT access token
    const signedAccessToken = await signAccessToken({
      sub: authCode.userId,
      clientId: data.client_id,
      scope: authCode.scope,
    });

    // Sign ID token if openid scope requested
    let idToken: string | undefined;
    if (authCode.scope.includes("openid")) {
      idToken = await signIdToken({
        sub: authCode.userId,
        email: user.email,
        name: user.name,
        picture: user.avatarUrl ?? undefined,
        aud: data.client_id,
      });
    }

    return NextResponse.json({
      access_token: signedAccessToken,
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: rawRefreshToken,
      id_token: idToken,
      scope: authCode.scope,
    });
  }

  return NextResponse.json(
    { error: "unsupported_grant_type" },
    { status: 400 },
  );
}
