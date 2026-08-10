import { NextResponse } from "next/server";
import { createOAuthLinkState } from "@/lib/auth/oauth-state";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://accounts.prohor.dev";

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/login?error=github_not_configured", appUrl),
    );
  }

  const redirectUri = `${appUrl}/api/auth/callback/github`;
  const scope = "user:email";

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
  githubAuthUrl.searchParams.set("scope", scope);

  // If user is logged in, create a secure link state (CSRF-safe)
  const user = await getCurrentUser();
  if (user) {
    const linkState = await createOAuthLinkState(user.id, "github");
    githubAuthUrl.searchParams.set("state", linkState);
  }

  return NextResponse.redirect(githubAuthUrl.toString());
}
