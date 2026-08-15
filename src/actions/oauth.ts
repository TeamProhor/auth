"use server";

import { createHash, randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { authorizationCodes, oauthClients, userConsents } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { getCurrentUser } from "@/lib/auth/session";

function getSafeRedirectUrl(
  redirectUri: string,
  allowedUris: string[],
): string | null {
  try {
    const parsed = new URL(redirectUri);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    const isAllowed = allowedUris.some((allowed) => {
      try {
        const allowedParsed = new URL(allowed);
        return (
          allowedParsed.origin === parsed.origin &&
          parsed.pathname.startsWith(allowedParsed.pathname)
        );
      } catch {
        return false;
      }
    });
    return isAllowed ? parsed.href : null;
  } catch {
    return null;
  }
}

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

  if (!client) {
    redirect("/login?error=invalid_client");
  }

  const safeTargetUrl = getSafeRedirectUrl(
    params.redirectUri,
    client.redirectUris,
  );
  if (!safeTargetUrl) {
    redirect("/dashboard?error=unauthorized_redirect_uri");
  }

  // Generate authorization code
  const code = randomBytes(32).toString("hex");
  const codeHash = createHash("sha256").update(code).digest("hex");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await db.insert(authorizationCodes).values({
    codeHash,
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
      .set({ scopes: params.scope.split(" "), updatedAt: new Date() })
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
      scopes: params.scope.split(" "),
    });
  }

  await logEvent({
    userId: user.id,
    eventType: "app_approved",
    details: params.clientId,
  });

  const approvedUrl = new URL(safeTargetUrl);
  approvedUrl.searchParams.set("code", code);
  if (params.state) approvedUrl.searchParams.set("state", params.state);

  redirect(approvedUrl.href);
}

// ─── Deny OAuth Consent ───────────────────────────────────────────────────────

export async function denyConsentAction(params: {
  redirectUri: string;
  state?: string;
}): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  let deniedUrl: URL;
  try {
    deniedUrl = new URL(params.redirectUri);
    if (!["http:", "https:"].includes(deniedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
  } catch {
    redirect("/dashboard?error=invalid_redirect_uri");
  }
  deniedUrl.searchParams.set("error", "access_denied");
  if (params.state) deniedUrl.searchParams.set("state", params.state);

  const safeDeniedHref = deniedUrl.href;
  redirect(safeDeniedHref);
}

// ─── Revoke App Access (User side) ───────────────────────────────────────────

export async function revokeAppAccessAction(clientId: string): Promise<void> {
  const { revalidatePath } = await import("next/cache");
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await db
    .delete(userConsents)
    .where(
      and(
        eq(userConsents.userId, user.id),
        eq(userConsents.clientId, clientId),
      ),
    );

  await logEvent({
    userId: user.id,
    eventType: "app_revoked",
    details: clientId,
  });
  revalidatePath("/dashboard");
}

// ─── Create OAuth Client (Developer App) ───────────────────────────────────

export async function createOAuthClientAction(formData: FormData): Promise<{
  success: boolean;
  error?: string;
  client?: {
    clientId: string;
    clientSecret?: string;
    name: string;
  };
}> {
  const { revalidatePath } = await import("next/cache");
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "অননুমোদিত অনুরোধ।" };

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const appType = (formData.get("appType")?.toString() || "web") as
    | "web"
    | "native"
    | "spa"
    | "service";
  const redirectUrisRaw = formData.get("redirectUris")?.toString().trim() || "";

  if (!name || name.length < 2) {
    return { success: false, error: "অনুগ্রহ করে একটি বৈধ অ্যাপ্লিকেশনের নাম লিখুন।" };
  }

  const redirectUris = redirectUrisRaw
    .split(/[\n,]+/)
    .map((u) => u.trim())
    .filter(Boolean);

  if (appType !== "native" && redirectUris.length === 0) {
    return { success: false, error: "অন্তত একটি রিডাইরেক্ট URI প্রদান করুন।" };
  }

  const clientId = `client_${randomBytes(12).toString("hex")}`;
  const clientSecret = `secret_${randomBytes(24).toString("hex")}`;
  const { createHash } = await import("node:crypto");
  const clientSecretHash = createHash("sha256")
    .update(clientSecret)
    .digest("hex");

  try {
    await db.insert(oauthClients).values({
      ownerId: user.id,
      clientId,
      clientSecretHash,
      name,
      description,
      appType,
      redirectUris,
      isActive: true,
    });

    revalidatePath("/dashboard/oauth-keys");
    return {
      success: true,
      client: {
        clientId,
        clientSecret,
        name,
      },
    };
  } catch {
    return { success: false, error: "অ্যাপ তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" };
  }
}

// ─── Delete OAuth Client ───────────────────────────────────────────────────

export async function deleteOAuthClientAction(clientId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const { revalidatePath } = await import("next/cache");
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "অননুমোদিত অনুরোধ।" };

  try {
    await db
      .delete(oauthClients)
      .where(
        and(
          eq(oauthClients.clientId, clientId),
          eq(oauthClients.ownerId, user.id),
        ),
      );

    revalidatePath("/dashboard/oauth-keys");
    return { success: true };
  } catch {
    return { success: false, error: "অ্যাপ মুছে ফেলতে সমস্যা হয়েছে।" };
  }
}

// ─── Create Personal API Key ───────────────────────────────────────────────

export async function createPersonalApiKeyAction(formData: FormData): Promise<{
  success: boolean;
  error?: string;
  apiKey?: {
    name: string;
    key: string;
    keyPrefix: string;
  };
}> {
  const { revalidatePath } = await import("next/cache");
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "অননুমোদিত অনুরোধ।" };

  const name = formData.get("name")?.toString().trim();
  if (!name || name.length < 2) {
    return { success: false, error: "কী-এর জন্য একটি নাম লিখুন।" };
  }

  const { personalApiKeys } = await import("@/db/schema");
  const { createHash } = await import("node:crypto");

  const randomHex = randomBytes(24).toString("hex");
  const keyPrefix = `pk_live_${randomHex.slice(0, 6)}`;
  const fullKey = `pk_live_${randomHex}`;
  const keyHash = createHash("sha256").update(fullKey).digest("hex");

  try {
    await db.insert(personalApiKeys).values({
      userId: user.id,
      name,
      keyPrefix,
      keyHash,
      scopes: ["read", "write"],
    });

    revalidatePath("/dashboard/oauth-keys");
    return {
      success: true,
      apiKey: {
        name,
        key: fullKey,
        keyPrefix,
      },
    };
  } catch {
    return { success: false, error: "API কী তৈরি করতে সমস্যা হয়েছে।" };
  }
}

// ─── Revoke / Delete Personal API Key ──────────────────────────────────────

export async function revokePersonalApiKeyAction(keyId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const { revalidatePath } = await import("next/cache");
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "অননুমোদিত অনুরোধ।" };

  const { personalApiKeys } = await import("@/db/schema");

  try {
    await db
      .delete(personalApiKeys)
      .where(
        and(eq(personalApiKeys.id, keyId), eq(personalApiKeys.userId, user.id)),
      );

    revalidatePath("/dashboard/oauth-keys");
    return { success: true };
  } catch {
    return { success: false, error: "API কী বাতিল করতে সমস্যা হয়েছে।" };
  }
}
