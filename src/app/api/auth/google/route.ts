import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://accounts.prohor.dev";

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", appUrl),
    );
  }

  const redirectUri = `${appUrl}/api/auth/callback/google`;
  const scope = "openid profile email";

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", scope);
  googleAuthUrl.searchParams.set("access_type", "online");

  return NextResponse.redirect(googleAuthUrl.toString());
}
