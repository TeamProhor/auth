"use server";

import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { authorizationCodes, oauthClients, userConsents } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { getCurrentUser } from "@/lib/auth/session";

// ─── Approve OAuth Consent ────────────────────────────────────────────────────

export async function approveConsentAction(params: {
  clientId: string;
  redirectUri: string;
  scope: string;
  state?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
}): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Validate client still exists
  const client = await db.query.oauthClients.findFirst({
    where: and(
      eq(oauthClients.clientId, params.clientId),
      eq(oauthClients.isActive, true),
    ),
  });

  if (!client?.redirectUris.includes(params.redirectUri)) {
    redirect("/login?error=invalid_client");
  }

  // Generate authorization code
  const code = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await db.insert(authorizationCodes).values({
    code,
    clientId: params.clientId,
    userId: user.id,
    redirectUri: params.redirectUri,
    scope: params.scope,
    codeChallenge: params.codeChallenge,
    codeChallengeMethod: params.codeChallengeMethod,
    expiresAt,
  });

  // Store consent for future auto-approval
  const existing = await db.query.userConsents.findFirst({
    where: and(
      eq(userConsents.userId, user.id),
      eq(userConsents.clientId, params.clientId),
    ),
  });

  if (existing) {
    await db
      .update(userConsents)
      .set({ grantedScopes: params.scope, updatedAt: new Date() })
      .where(
        and(
          eq(userConsents.userId, user.id),
          eq(userConsents.clientId, params.clientId),
        ),
      );
  } else {
    await db.insert(userConsents).values({
      userId: user.id,
      clientId: params.clientId,
      grantedScopes: params.scope,
    });
  }

  await logEvent({
    userId: user.id,
    eventType: "app_approved",
    details: params.clientId,
  });

  // Redirect back to the third-party app with authorization code
  const callbackUrl = new URL(params.redirectUri);
  callbackUrl.searchParams.set("code", code);
  if (params.state) callbackUrl.searchParams.set("state", params.state);

  redirect(callbackUrl.toString());
}

// ─── Deny OAuth Consent ───────────────────────────────────────────────────────

export async function denyConsentAction(params: {
  redirectUri: string;
  state?: string;
}): Promise<void> {
  const callbackUrl = new URL(params.redirectUri);
  callbackUrl.searchParams.set("error", "access_denied");
  if (params.state) callbackUrl.searchParams.set("state", params.state);

  redirect(callbackUrl.toString());
}
