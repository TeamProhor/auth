import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import {
  getGitHubAuthUrl,
  getGoogleAuthUrl,
  getOAuthRedirectUri,
} from "@/lib/auth/oauth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  if (provider !== "google" && provider !== "github") {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const isLinking = searchParams.get("link") === "true";

  const state = randomBytes(32).toString("hex");
  const origin = request.nextUrl.origin;
  const redirectUri = getOAuthRedirectUri(provider, origin);

  let authUrl = "";
  try {
    if (provider === "google") {
      authUrl = getGoogleAuthUrl(state, redirectUri);
    } else {
      authUrl = getGitHubAuthUrl(state, redirectUri);
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "OAuth configuration error";
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(message)}`, origin),
    );
  }

  const cookieStore = await cookies();
  const isHttps = origin.startsWith("https://");

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && isHttps,
    sameSite: "lax" as const,
    maxAge: 600, // 10 minutes
    path: "/",
  };

  cookieStore.set("oauth_state", state, cookieOptions);
  cookieStore.set("oauth_callback_url", callbackUrl, cookieOptions);
  cookieStore.set("oauth_is_linking", isLinking ? "1" : "0", cookieOptions);

  return NextResponse.redirect(authUrl);
}
