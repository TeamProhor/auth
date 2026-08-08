import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
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

  try {
    // 1. Exchange authorization code for access token
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
    let userEmail = ghUser.email;

    // If primary email is private on GitHub, fetch user emails list
    if (!userEmail) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "ProhorAuth-App",
        },
      });

      if (emailsRes.ok) {
        const emails = (await emailsRes.json()) as GitHubEmail[];
        const primaryEmailObj =
          emails.find((e) => e.primary && e.verified) ?? emails[0];
        if (primaryEmailObj) {
          userEmail = primaryEmailObj.email;
        }
      }
    }

    if (!userEmail) {
      return NextResponse.redirect(
        new URL("/login?error=github_no_email", appUrl),
      );
    }

    const name = ghUser.name || ghUser.login || "GitHub User";
    const avatarUrl = ghUser.avatar_url;

    // 3. Find or Create User in PostgreSQL
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail.toLowerCase()))
      .limit(1);

    let userId: string;

    if (existingUsers[0]) {
      userId = existingUsers[0].id;
      // Update avatar or provider if needed
      await db
        .update(users)
        .set({
          name: existingUsers[0].name || name,
          avatarUrl: existingUsers[0].avatarUrl || avatarUrl,
          provider: "github",
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          email: userEmail.toLowerCase(),
          name,
          avatarUrl,
          provider: "github",
        })
        .returning();
      userId = newUser.id;
    }

    // 4. Create Persistent Session & Redirect to Dashboard
    await createSession(userId, {
      ip: request.headers.get("x-forwarded-for") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    await logEvent({
      userId,
      eventType: "login_success",
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
      details: "LoggedIn via GitHub OAuth",
    });

    return NextResponse.redirect(new URL("/dashboard", appUrl));
  } catch (err) {
    console.error("[github oauth callback error]:", err);
    return NextResponse.redirect(
      new URL("/login?error=github_server_error", appUrl),
    );
  }
}
