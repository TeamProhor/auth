"use server";

import { revalidatePath } from "next/cache";
import { logEvent } from "@/lib/auth/audit";
import {
  getAdminUser,
  revokeAllSessions,
  revokeSession,
} from "@/lib/auth/session";

type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

export async function revokeUserSessionByAdminAction(
  sessionId: string,
  targetUserId: string,
): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "অননুমোদিত এক্সেস।" };

  await revokeSession(sessionId, targetUserId);

  await logEvent({
    userId: admin.id,
    eventType: "session_revoked",
    details: `Admin terminated session ${sessionId} for user ${targetUserId}`,
  });

  revalidatePath("/admin/users");
  return {
    success: true,
    message: "সেশন সফলভাবে বাতিল করা হয়েছে।",
  };
}

export async function revokeAllUserSessionsByAdminAction(
  targetUserId: string,
): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "অননুমোদিত এক্সেস।" };

  await revokeAllSessions(targetUserId);

  await logEvent({
    userId: admin.id,
    eventType: "all_sessions_revoked",
    details: `Admin terminated all sessions for user ${targetUserId}`,
  });

  revalidatePath("/admin/users");
  return {
    success: true,
    message: "ব্যবহারকারীর সমস্ত সক্রিয় সেশন সফলভাবে বাতিল করা হয়েছে।",
  };
}
