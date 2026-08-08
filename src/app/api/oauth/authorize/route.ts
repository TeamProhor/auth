import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { oauthClients } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { OAuthAuthorizeSchema } from "@/lib/validations";

// GET /api/oauth/authorize
// Validates the OAuth request and either redirects to the consent page
// or returns an error redirect.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const raw = {
    client_id: searchParams.get("client_id"),
    redirect_uri: searchParams.get("redirect_uri"),
    response_type: searchParams.get("response_type"),
    scope: searchParams.get("scope") ?? "openid profile email",
    state: searchParams.get("state") ?? undefined,
    code_challenge: searchParams.get("code_challenge") ?? undefined,
    code_challenge_method:
      searchParams.get("code_challenge_method") ?? undefined,
  };

  const parsed = OAuthAuthorizeSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_request",
        error_description: "Missing or invalid parameters.",
      },
      { status: 400 },
    );
  }

  const {
    client_id,
    redirect_uri,
    scope,
    state,
    code_challenge,
    code_challenge_method,
  } = parsed.data;

  // Validate client
  const client = await db.query.oauthClients.findFirst({
    where: eq(oauthClients.clientId, client_id),
  });

  if (!client?.isActive) {
    return NextResponse.json(
      { error: "invalid_client", error_description: "Unknown client." },
      { status: 401 },
    );
  }

  // Validate redirect_uri
  if (!client.redirectUris.includes(redirect_uri)) {
    return NextResponse.json(
      {
        error: "invalid_redirect_uri",
        error_description: "Redirect URI not registered.",
      },
      { status: 400 },
    );
  }

  // Build consent URL — all oauth params are passed to the consent page
  const consentUrl = new URL("/oauth/consent", request.url);
  consentUrl.searchParams.set("client_id", client_id);
  consentUrl.searchParams.set("redirect_uri", redirect_uri);
  consentUrl.searchParams.set("scope", scope);
  if (state) consentUrl.searchParams.set("state", state);
  if (code_challenge)
    consentUrl.searchParams.set("code_challenge", code_challenge);
  if (code_challenge_method)
    consentUrl.searchParams.set("code_challenge_method", code_challenge_method);

  // If user is already authenticated, go to consent page
  // If not, redirect to login with return_to
  const user = await getCurrentUser();
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("return_to", consentUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(consentUrl);
}
