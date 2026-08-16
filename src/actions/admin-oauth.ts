"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { oauthClients, personalApiKeys } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { getAdminUser } from "@/lib/auth/session";

type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

export async function toggleOAuthClientActiveAction(
  clientId: string,
  isActive: boolean,
): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "অননুমোদিত এক্সেস।" };

  await db
    .update(oauthClients)
    .set({
      isActive,
      updatedAt: new Date(),
    })
    .where(eq(oauthClients.clientId, clientId));

  await logEvent({
    userId: admin.id,
    eventType: "profile_updated",
    details: `OAuth client ${clientId} active status set to ${isActive}`,
  });

  revalidatePath("/admin/oauth-apps");
  return {
    success: true,
    message: isActive
      ? "OAuth অ্যাপটি সক্রিয় করা হয়েছে।"
      : "OAuth অ্যাপটি স্থগিত (Suspended) করা হয়েছে।",
  };
}

export async function revokeApiKeyByAdminAction(
  keyId: string,
): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "অননুমোদিত এক্সেস।" };

  await db
    .update(personalApiKeys)
    .set({
      revokedAt: new Date(),
    })
    .where(eq(personalApiKeys.id, keyId));

  await logEvent({
    userId: admin.id,
    eventType: "profile_updated",
    details: `Admin revoked personal API key ${keyId}`,
  });

  revalidatePath("/admin/oauth-apps");
  return {
    success: true,
    message: "API Key সফলভাবে বাতিল করা হয়েছে।",
  };
}
