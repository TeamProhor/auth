"use server";

import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { oauthClients, userConsents } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { hashPassword } from "@/lib/auth/crypto";
import { getCurrentUser } from "@/lib/auth/session";
import { CreateAppSchema } from "@/lib/validations";

type ActionResult =
  | { success: true; data?: Record<string, string> }
  | { success: false; error: string };

function generateClientId(): string {
  return `pr_client_${randomBytes(12).toString("hex")}`;
}

function generateClientSecret(): string {
  return `pr_secret_${randomBytes(24).toString("hex")}`;
}

// ─── Create OAuth App ─────────────────────────────────────────────────────────

export async function createAppAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const raw = {
    name: formData.get("name") as string,
    appType: formData.get("appType") as string,
    redirectUri: formData.get("redirectUri") as string,
  };

  const parsed = CreateAppSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "অকার্যকর তথ্য।",
    };
  }

  const clientId = generateClientId();
  const clientSecret = generateClientSecret();
  const clientSecretHash = await hashPassword(clientSecret);

  const redirectUris = parsed.data.redirectUri ? [parsed.data.redirectUri] : [];

  await db.insert(oauthClients).values({
    clientId,
    clientSecretHash,
    name: parsed.data.name,
    appType: parsed.data.appType as "web" | "native" | "service",
    redirectUris,
    createdByUserId: user.id,
  });

  revalidatePath("/developer/apps");

  // Return the plaintext secret once — it won't be shown again
  return { success: true, data: { clientId, clientSecret } };
}

// ─── Add Redirect URI ─────────────────────────────────────────────────────────

export async function addRedirectUriAction(
  clientId: string,
  uri: string,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const app = await db.query.oauthClients.findFirst({
    where: and(
      eq(oauthClients.clientId, clientId),
      eq(oauthClients.createdByUserId, user.id),
    ),
  });

  if (!app) return { success: false, error: "অ্যাপ পাওয়া যায়নি।" };

  const updated = [...app.redirectUris, uri];
  await db
    .update(oauthClients)
    .set({ redirectUris: updated, updatedAt: new Date() })
    .where(eq(oauthClients.clientId, clientId));

  revalidatePath("/developer/apps");
  return { success: true };
}

// ─── Remove Redirect URI ──────────────────────────────────────────────────────

export async function removeRedirectUriAction(
  clientId: string,
  uri: string,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const app = await db.query.oauthClients.findFirst({
    where: and(
      eq(oauthClients.clientId, clientId),
      eq(oauthClients.createdByUserId, user.id),
    ),
  });

  if (!app) return { success: false, error: "অ্যাপ পাওয়া যায়নি।" };

  const updated = app.redirectUris.filter((u) => u !== uri);
  await db
    .update(oauthClients)
    .set({ redirectUris: updated, updatedAt: new Date() })
    .where(eq(oauthClients.clientId, clientId));

  revalidatePath("/developer/apps");
  return { success: true };
}

// ─── Rotate Client Secret ─────────────────────────────────────────────────────

export async function rotateClientSecretAction(
  clientId: string,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const app = await db.query.oauthClients.findFirst({
    where: and(
      eq(oauthClients.clientId, clientId),
      eq(oauthClients.createdByUserId, user.id),
    ),
  });

  if (!app) return { success: false, error: "অ্যাপ পাওয়া যায়নি।" };

  const newSecret = generateClientSecret();
  const newSecretHash = await hashPassword(newSecret);

  await db
    .update(oauthClients)
    .set({ clientSecretHash: newSecretHash, updatedAt: new Date() })
    .where(eq(oauthClients.clientId, clientId));

  revalidatePath("/developer/apps");
  return { success: true, data: { clientSecret: newSecret } };
}

// ─── Delete App ───────────────────────────────────────────────────────────────

export async function deleteAppAction(clientId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await db
    .delete(oauthClients)
    .where(
      and(
        eq(oauthClients.clientId, clientId),
        eq(oauthClients.createdByUserId, user.id),
      ),
    );

  revalidatePath("/developer/apps");
  return { success: true };
}

// ─── Get My Apps ──────────────────────────────────────────────────────────────

export async function getMyApps() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db.query.oauthClients.findMany({
    where: eq(oauthClients.createdByUserId, user.id),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
}

// ─── Revoke App Access (User side) ───────────────────────────────────────────

export async function revokeAppAccessAction(clientId: string): Promise<void> {
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
