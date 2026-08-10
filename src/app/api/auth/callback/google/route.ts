import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { consumeOAuthLinkState } from "@/lib/auth/oauth-state";
import { createSession } from "@/lib/auth/session";

interface GoogleUserInfo {
  sub: string;
  name?: string;
  given_name?: string;
  picture?: string;
  email: string;
  email_verified?: boolean;
}

export async function GET(request: NextRequest) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://accounts.prohor.dev";
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/login?error=google_cancelled", appUrl),
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", appUrl),
    );
  }

  const redirectUri = `${appUrl}/api/auth/callback/google`;
  const ip = request.headers.get("x-forwarded-for") ?? undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(
        new URL("/login?error=google_token_error", appUrl),
      );
    }

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(
        new URL("/login?error=google_token_error", appUrl),
      );
    }

    const accessToken = tokenData.access_token as string;

    // 2. Fetch Google User Profile
    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!profileRes.ok) {
      return NextResponse.redirect(
        new URL("/login?error=google_profile_error", appUrl),
      );
    }

    const gUser = (await profileRes.json()) as GoogleUserInfo;
    const providerAccountId = gUser.sub;

    // Reject unverified Google emails
    if (!gUser.email || !gUser.email_verified) {
      return NextResponse.redirect(
        new URL("/login?error=google_email_not_verified", appUrl),
      );
    }

    const verifiedEmail = gUser.email.toLowerCase();
    const name = gUser.name || gUser.given_name || "Google User";
    const avatarUrl = gUser.picture;

    // ─── EXPLICIT LINK FLOW (logged-in user linking a new provider) ────────────

    if (state) {
      const linkingUserId = await consumeOAuthLinkState(state, "google");

      if (!linkingUserId) {
        return NextResponse.redirect(
          new URL("/dashboard/security?error=link_state_invalid", appUrl),
        );
      }

      // Check: is this Google account already linked to ANOTHER user?
      const existingOwner = await db.query.accounts.findFirst({
        where: and(
          eq(accounts.provider, "google"),
          eq(accounts.providerAccountId, providerAccountId),
        ),
      });

      if (existingOwner && existingOwner.userId !== linkingUserId) {
        await logEvent({
          userId: linkingUserId,
          eventType: "oauth_link_failed",
          ipAddress: ip,
          details: `Google sub ${providerAccountId} already owned by another account`,
        });
        return NextResponse.redirect(
          new URL("/dashboard/security?error=provider_already_linked", appUrl),
        );
      }

      if (!existingOwner) {
        await db.insert(accounts).values({
          userId: linkingUserId,
          provider: "google",
          providerAccountId,
          providerUsername: verifiedEmail,
        });

        await logEvent({
          userId: linkingUserId,
          eventType: "oauth_account_linked",
          ipAddress: ip,
          details: `Linked Google account sub: ${providerAccountId} (${verifiedEmail})`,
        });
      }

      return NextResponse.redirect(
        new URL("/dashboard/security?success=google_linked", appUrl),
      );
    }

    // ─── LOGIN FLOW ───────────────────────────────────────────────────────────

    // Priority 1: Find by providerAccountId (most reliable)
    const accountByProvider = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.provider, "google"),
        eq(accounts.providerAccountId, providerAccountId),
      ),
    });

    if (accountByProvider) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, accountByProvider.userId),
      });

      if (existingUser?.twoFactorEnabled) {
        return NextResponse.redirect(
          new URL(`/login?2fa_user_id=${existingUser.id}`, appUrl),
        );
      }

      await createSession(accountByProvider.userId, { ip, userAgent });
      await logEvent({
        userId: accountByProvider.userId,
        eventType: "login",
        ipAddress: ip,
        details: "Login via Google (provider ID match)",
      });
      return NextResponse.redirect(new URL("/dashboard", appUrl));
    }

    // Priority 2: Check whether verified email belongs to an existing Prohor user.
    // If it does, we MUST NOT auto-link. The user must sign in to their existing
    // account and connect Google from Security → Connected Accounts explicitly.
    const emailOwner = await db.query.users.findFirst({
      where: eq(users.email, verifiedEmail),
    });

    if (emailOwner) {
      await logEvent({
        userId: emailOwner.id,
        eventType: "oauth_link_failed",
        ipAddress: ip,
        details: `Google login rejected: email belongs to existing account (no linked provider)`,
      });
      return NextResponse.redirect(
        new URL("/login?error=email_account_exists", appUrl),
      );
    }

    // Priority 3: No existing user — create new user
    const [newUser] = await db
      .insert(users)
      .values({
        email: verifiedEmail,
        name,
        avatarUrl,
        emailVerified: true,
      })
      .returning();

    await db.insert(accounts).values({
      userId: newUser.id,
      provider: "google",
      providerAccountId,
      providerUsername: verifiedEmail,
    });

    await logEvent({
      userId: newUser.id,
      eventType: "register",
      ipAddress: ip,
      details: "Registered via Google OAuth",
    });

    await createSession(newUser.id, { ip, userAgent });
    return NextResponse.redirect(new URL("/dashboard", appUrl));
  } catch (err) {
    console.error("[google oauth callback error]:", err);
    return NextResponse.redirect(
      new URL("/login?error=google_server_error", appUrl),
    );
  }
}
