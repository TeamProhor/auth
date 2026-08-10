import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull, lt } from "drizzle-orm";
import { db } from "@/db";
import { oauthLinkRequests } from "@/db/schema";

const LINK_STATE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// ─── Create a secure OAuth link state ─────────────────────────────────────────

export async function createOAuthLinkState(
  userId: string,
  provider: "google" | "github",
): Promise<string> {
  // Clean up expired states first
  await db
    .delete(oauthLinkRequests)
    .where(
      and(
        eq(oauthLinkRequests.userId, userId),
        lt(oauthLinkRequests.expiresAt, new Date()),
      ),
    );

  const rawState = randomBytes(32).toString("hex");
  const stateHash = createHash("sha256").update(rawState).digest("hex");
  const expiresAt = new Date(Date.now() + LINK_STATE_DURATION_MS);

  await db.insert(oauthLinkRequests).values({
    userId,
    provider,
    stateHash,
    expiresAt,
  });

  return rawState;
}

// ─── Consume a state token → returns userId if valid ─────────────────────────

export async function consumeOAuthLinkState(
  rawState: string,
  expectedProvider: "google" | "github",
): Promise<string | null> {
  const stateHash = createHash("sha256").update(rawState).digest("hex");

  const record = await db.query.oauthLinkRequests.findFirst({
    where: and(
      eq(oauthLinkRequests.stateHash, stateHash),
      eq(oauthLinkRequests.provider, expectedProvider),
      isNull(oauthLinkRequests.usedAt),
      gt(oauthLinkRequests.expiresAt, new Date()),
    ),
  });

  if (!record) return null;

  // Mark as used (single-use)
  await db
    .update(oauthLinkRequests)
    .set({ usedAt: new Date() })
    .where(eq(oauthLinkRequests.id, record.id));

  return record.userId;
}
