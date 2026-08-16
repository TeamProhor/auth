import { and, eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import {
  exchangeGitHubCode,
  exchangeGoogleCode,
  getOAuthRedirectUri,
  type OAuthUserProfile,
} from "@/lib/auth/oauth";
import { createSession, getCurrentUser } from "@/lib/auth/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const origin = request.nextUrl.origin;

  if (provider !== "google" && provider !== "github") {
    return NextResponse.redirect(
      new URL("/login?error=Invalid+provider", origin),
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("oauth_state")?.value;
  const callbackUrl =
    cookieStore.get("oauth_callback_url")?.value || "/dashboard";
  const isLinking = cookieStore.get("oauth_is_linking")?.value === "1";

  // Clean up state cookies
  cookieStore.delete("oauth_state");
  cookieStore.delete("oauth_callback_url");
  cookieStore.delete("oauth_is_linking");

  if (error) {
    const dest = isLinking ? "/dashboard/security" : "/login";
    return NextResponse.redirect(
      new URL(
        `${dest}?error=${encodeURIComponent(error || "OAuth cancelled")}`,
        origin,
      ),
    );
  }

  if (!code || !state || state !== savedState) {
    const dest = isLinking ? "/dashboard/security" : "/login";
    const errorKey = isLinking ? "LINK_ERROR_STATE" : "Invalid+OAuth+state";
    return NextResponse.redirect(new URL(`${dest}?error=${errorKey}`, origin));
  }

  const redirectUri = getOAuthRedirectUri(provider, origin);

  let profile: OAuthUserProfile;
  try {
    if (provider === "google") {
      profile = await exchangeGoogleCode(code, redirectUri);
    } else {
      profile = await exchangeGitHubCode(code, redirectUri);
    }
  } catch (err: unknown) {
    console.error(`OAuth token exchange error (${provider}):`, err);
    const dest = isLinking ? "/dashboard/security" : "/login";
    return NextResponse.redirect(
      new URL(
        `${dest}?error=${encodeURIComponent("Authentication failed. Please try again.")}`,
        origin,
      ),
    );
  }

  const headersList = await headers();
  const rawIp =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    undefined;
  const ip = rawIp ? rawIp.replace(/^::ffff:/, "") : undefined;
  const userAgent = headersList.get("user-agent") ?? undefined;
  const meta = { ip, userAgent };

  // ─── Case 1: Account Linking (user already logged in) ──────────────────────
  if (isLinking) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.redirect(new URL("/login", origin));
    }

    // Check if provider account is already linked to another user
    const existingAccount = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.provider, provider),
        eq(accounts.providerAccountId, profile.id),
      ),
    });

    if (existingAccount) {
      if (existingAccount.userId === currentUser.id) {
        return NextResponse.redirect(
          new URL(
            `/dashboard/security?success=LINK_SUCCESS_${provider.toUpperCase()}`,
            origin,
          ),
        );
      }
      return NextResponse.redirect(
        new URL("/dashboard/security?error=LINK_ERROR_TAKEN", origin),
      );
    }

    await db.insert(accounts).values({
      userId: currentUser.id,
      provider,
      providerAccountId: profile.id,
      providerUsername: profile.email || profile.name,
    });

    await logEvent({
      userId: currentUser.id,
      eventType: "oauth_account_linked",
      ipAddress: meta.ip,
      details: `Linked provider: ${provider}`,
    });

    return NextResponse.redirect(
      new URL(
        `/dashboard/security?success=LINK_SUCCESS_${provider.toUpperCase()}`,
        origin,
      ),
    );
  }

  // ─── Case 2: Sign-In / Sign-Up ──────────────────────────────────────────────
  // 1. Check if an account exists for this provider and providerAccountId
  const account = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.provider, provider),
      eq(accounts.providerAccountId, profile.id),
    ),
  });

  let user = null;

  if (account) {
    user = await db.query.users.findFirst({
      where: eq(users.id, account.userId),
    });
  }

  // 2. If no account found by provider ID, look up user by email
  if (!user && profile.email) {
    user = await db.query.users.findFirst({
      where: eq(users.email, profile.email),
    });

    if (user) {
      // Link provider to this existing user
      await db.insert(accounts).values({
        userId: user.id,
        provider,
        providerAccountId: profile.id,
        providerUsername: profile.email || profile.name,
      });

      await logEvent({
        userId: user.id,
        eventType: "oauth_account_linked",
        ipAddress: meta.ip,
        details: `Auto-linked provider: ${provider}`,
      });
    }
  }

  // 3. If user still does not exist, create new user + account
  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
        emailVerified: true,
      })
      .returning();

    if (!newUser) {
      return NextResponse.redirect(
        new URL("/login?error=Could+not+create+user", origin),
      );
    }

    user = newUser;

    await db.insert(accounts).values({
      userId: user.id,
      provider,
      providerAccountId: profile.id,
      providerUsername: profile.email || profile.name,
    });

    await logEvent({
      userId: user.id,
      eventType: "register",
      ipAddress: meta.ip,
      details: `via ${provider}`,
    });
  }

  if (user.isBanned) {
    return NextResponse.redirect(
      new URL("/login?error=Account+is+banned", origin),
    );
  }

  // Handle 2FA if enabled
  if (user.twoFactorEnabled) {
    return NextResponse.redirect(
      new URL(`/login?twoFactorUserId=${encodeURIComponent(user.id)}`, origin),
    );
  }

  // Create session
  await createSession(user.id, meta);

  await logEvent({
    userId: user.id,
    eventType: "login",
    ipAddress: meta.ip,
    details: `via ${provider}`,
  });

  const destUrl = callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
  return NextResponse.redirect(new URL(destUrl, origin));
}
