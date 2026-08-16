"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { getAdminUser, revokeAllSessions } from "@/lib/auth/session";

type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

export async function toggleBanUserAction(
  userId: string,
  isBanned: boolean,
): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "অননুমোদিত এক্সেস।" };

  if (admin.id === userId && isBanned) {
    return { success: false, error: "আপনি নিজেকে নিষিদ্ধ (Ban) করতে পারবেন না।" };
  }

  await db
    .update(users)
    .set({
      isBanned,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  // If banning user, terminate all their active sessions immediately
  if (isBanned) {
    await revokeAllSessions(userId);
  }

  await logEvent({
    userId: admin.id,
    eventType: isBanned ? "user_banned" : "user_unbanned",
    details: `Target User: ${userId}`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return {
    success: true,
    message: isBanned
      ? "ব্যবহারকারীকে সফলভাবে নিষিদ্ধ (Ban) করা হয়েছে।"
      : "ব্যবহারকারীর নিষেধাজ্ঞা সফলভাবে প্রত্যাহার করা হয়েছে।",
  };
}

export async function toggleAdminStatusAction(
  userId: string,
  isAdmin: boolean,
): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "অননুমোদিত এক্সেস।" };

  if (admin.id === userId && !isAdmin) {
    return {
      success: false,
      error: "আপনি নিজের অ্যাডমিন পদমর্যাদা অপসারণ করতে পারবেন না।",
    };
  }

  await db
    .update(users)
    .set({
      isAdmin,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  await logEvent({
    userId: admin.id,
    eventType: "profile_updated",
    details: `Admin role ${isAdmin ? "granted" : "revoked"} for user ${userId}`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return {
    success: true,
    message: isAdmin
      ? "ব্যবহারকারীকে অ্যাডমিন ক্ষমতা প্রদান করা হয়েছে।"
      : "ব্যবহারকারীর অ্যাডমিন ক্ষমতা প্রত্যাহার করা হয়েছে।",
  };
}

export async function toggleEmailVerifiedAction(
  userId: string,
  emailVerified: boolean,
): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "অননুমোদিত এক্সেস।" };

  await db
    .update(users)
    .set({
      emailVerified,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  await logEvent({
    userId: admin.id,
    eventType: "profile_updated",
    details: `Email verification set to ${emailVerified} for user ${userId}`,
  });

  revalidatePath("/admin/users");
  return {
    success: true,
    message: "ইমেইল ভেরিফিকেশন স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।",
  };
}
