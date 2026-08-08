"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { getCurrentUser } from "@/lib/auth/session";
import { getDeveloperUsers } from "@/lib/queries";

// ─── Ban a user from the developer's app ──────────────────────────────────────

export async function banUserAction(targetUserId: string): Promise<void> {
  const dev = await getCurrentUser();
  if (!dev) redirect("/login");

  // Verify the target user has consented to one of this developer's apps
  const { users: authorizedUsers } = await getDeveloperUsers(dev.id, 1000, 0);
  const isAuthorized = authorizedUsers.some((u) => u.user.id === targetUserId);
  if (!isAuthorized) return;

  await db
    .update(users)
    .set({ isBanned: true, updatedAt: new Date() })
    .where(eq(users.id, targetUserId));

  await logEvent({
    userId: dev.id,
    eventType: "user_banned",
    details: `Banned user ${targetUserId}`,
  });

  revalidatePath("/developer/users");
}

// ─── Unban a user ─────────────────────────────────────────────────────────────

export async function unbanUserAction(targetUserId: string): Promise<void> {
  const dev = await getCurrentUser();
  if (!dev) redirect("/login");

  const { users: authorizedUsers } = await getDeveloperUsers(dev.id, 1000, 0);
  const isAuthorized = authorizedUsers.some((u) => u.user.id === targetUserId);
  if (!isAuthorized) return;

  await db
    .update(users)
    .set({ isBanned: false, updatedAt: new Date() })
    .where(eq(users.id, targetUserId));

  await logEvent({
    userId: dev.id,
    eventType: "user_unbanned",
    details: `Unbanned user ${targetUserId}`,
  });

  revalidatePath("/developer/users");
}
