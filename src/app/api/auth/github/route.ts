import { NextResponse } from "next/server";

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

  return NextResponse.redirect(githubAuthUrl.toString());
}
