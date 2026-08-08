import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyAccessToken } from "@/lib/auth/jwt";

// GET /api/oauth/userinfo
// Protected by Bearer access token (OIDC UserInfo endpoint)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const claims = await verifyAccessToken(token);

  if (!claims) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, claims.sub),
  });

  if (!user || user.isBanned) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const scopes = claims.scope.split(" ");
  const response: Record<string, unknown> = { sub: user.id };

  if (scopes.includes("profile")) {
    response.name = user.name;
    response.picture = user.avatarUrl ?? null;
  }

  if (scopes.includes("email")) {
    response.email = user.email;
    response.email_verified = user.emailVerified;
  }

  return NextResponse.json(response);
}
