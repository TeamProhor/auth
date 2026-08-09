import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
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

  try {
    // 1. Exchange code for tokens with Google OAuth endpoint
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
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
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!profileRes.ok) {
      return NextResponse.redirect(
        new URL("/login?error=google_profile_error", appUrl),
      );
    }

    const gUser = (await profileRes.json()) as GoogleUserInfo;
    const userEmail = gUser.email;

    if (!userEmail) {
      return NextResponse.redirect(
        new URL("/login?error=google_no_email", appUrl),
      );
    }

    const name = gUser.name || gUser.given_name || "Google User";
    const avatarUrl = gUser.picture;

    // 3. Find or Create User in SQLite Database
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail.toLowerCase()))
      .limit(1);

    let userId: string;

    if (existingUsers[0]) {
      userId = existingUsers[0].id;
      await db
        .update(users)
        .set({
          name: existingUsers[0].name || name,
          avatarUrl: existingUsers[0].avatarUrl || avatarUrl,
          emailVerified: gUser.email_verified ?? true,
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
          emailVerified: gUser.email_verified ?? true,
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
      eventType: "login",
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
      details: "LoggedIn via Google OAuth",
    });

    return NextResponse.redirect(new URL("/dashboard", appUrl));
  } catch (err) {
    console.error("[google oauth callback error]:", err);
    return NextResponse.redirect(
      new URL("/login?error=google_server_error", appUrl),
    );
  }
}
