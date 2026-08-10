import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { consumeOAuthLinkState } from "@/lib/auth/oauth-state";
import { createSession } from "@/lib/auth/session";

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
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
      new URL("/login?error=github_cancelled", appUrl),
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/login?error=github_not_configured", appUrl),
    );
  }

  const ip = request.headers.get("x-forwarded-for") ?? undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      },
    );

    if (!tokenRes.ok) {
      return NextResponse.redirect(
        new URL("/login?error=github_token_error", appUrl),
      );
    }

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(
        new URL("/login?error=github_token_error", appUrl),
      );
    }

    const accessToken = tokenData.access_token as string;

    // 2. Fetch GitHub User Profile
    const profileRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "ProhorAuth-App",
      },
    });

    if (!profileRes.ok) {
      return NextResponse.redirect(
        new URL("/login?error=github_profile_error", appUrl),
      );
    }

    const ghUser = (await profileRes.json()) as GitHubUser;
    const providerAccountId = String(ghUser.id);

    // 3. Fetch verified email from GitHub
    let verifiedEmail: string | null = ghUser.email;

    if (!verifiedEmail) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "ProhorAuth-App",
        },
      });

      if (emailsRes.ok) {
        const emails = (await emailsRes.json()) as GitHubEmail[];
        const primaryVerified =
          emails.find((e) => e.primary && e.verified) ??
          emails.find((e) => e.verified);
        if (primaryVerified) {
          verifiedEmail = primaryVerified.email;
        }
      }
    }

    const name = ghUser.name || ghUser.login || "GitHub User";
    const avatarUrl = ghUser.avatar_url;

    // ─── EXPLICIT LINK FLOW (logged-in user linking a new provider) ────────────

    if (state) {
      const linkingUserId = await consumeOAuthLinkState(state, "github");

      if (!linkingUserId) {
        // State invalid / expired / already used
        return NextResponse.redirect(
          new URL("/dashboard/security?error=link_state_invalid", appUrl),
        );
      }

      // Check: is this GitHub account already linked to ANOTHER user?
      const existingOwner = await db.query.accounts.findFirst({
        where: and(
          eq(accounts.provider, "github"),
          eq(accounts.providerAccountId, providerAccountId),
        ),
      });

      if (existingOwner && existingOwner.userId !== linkingUserId) {
        await logEvent({
          userId: linkingUserId,
          eventType: "oauth_link_failed",
          ipAddress: ip,
          details: `GitHub ID ${providerAccountId} already owned by another account`,
        });
        return NextResponse.redirect(
          new URL("/dashboard/security?error=provider_already_linked", appUrl),
        );
      }

      // Link if not already linked
      if (!existingOwner) {
        await db.insert(accounts).values({
          userId: linkingUserId,
          provider: "github",
          providerAccountId,
          providerUsername: ghUser.login,
        });

        await logEvent({
          userId: linkingUserId,
          eventType: "oauth_account_linked",
          ipAddress: ip,
          details: `Linked GitHub account ID: ${providerAccountId} (${ghUser.login})`,
        });
      }

      return NextResponse.redirect(
        new URL("/dashboard/security?success=github_linked", appUrl),
      );
    }

    // ─── LOGIN FLOW ───────────────────────────────────────────────────────────

    // Priority 1: Find by providerAccountId (most reliable)
    const accountByProvider = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.provider, "github"),
        eq(accounts.providerAccountId, providerAccountId),
      ),
    });

    if (accountByProvider) {
      await createSession(accountByProvider.userId, { ip, userAgent });
      await logEvent({
        userId: accountByProvider.userId,
        eventType: "login",
        ipAddress: ip,
        details: "Login via GitHub (provider ID match)",
      });
      return NextResponse.redirect(new URL("/dashboard", appUrl));
    }

    // Priority 2: Check whether verified email belongs to an existing Prohor user.
    // If it does, we MUST NOT auto-link. The user must sign in to their existing
    // account and connect GitHub from Security → Connected Accounts explicitly.
    if (!verifiedEmail) {
      return NextResponse.redirect(
        new URL("/login?error=github_no_verified_email", appUrl),
      );
    }

    const emailOwner = await db.query.users.findFirst({
      where: eq(users.email, verifiedEmail.toLowerCase()),
    });

    if (emailOwner) {
      await logEvent({
        userId: emailOwner.id,
        eventType: "oauth_link_failed",
        ipAddress: ip,
        details: `GitHub login rejected: email belongs to existing account (no linked provider)`,
      });
      return NextResponse.redirect(
        new URL("/login?error=email_account_exists", appUrl),
      );
    }

    // Priority 3: No existing user — create new user and link provider
    const [newUser] = await db
      .insert(users)
      .values({
        email: verifiedEmail.toLowerCase(),
        name,
        avatarUrl,
        emailVerified: true,
      })
      .returning();

    await db.insert(accounts).values({
      userId: newUser.id,
      provider: "github",
      providerAccountId,
      providerUsername: ghUser.login,
    });

    await logEvent({
      userId: newUser.id,
      eventType: "register",
      ipAddress: ip,
      details: "Registered via GitHub OAuth",
    });

    await createSession(newUser.id, { ip, userAgent });
    return NextResponse.redirect(new URL("/dashboard", appUrl));
  } catch (err) {
    console.error("[github oauth callback error]:", err);
    return NextResponse.redirect(
      new URL("/login?error=github_server_error", appUrl),
    );
  }
}
