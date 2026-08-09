"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { hashPassword, verifyPassword } from "@/lib/auth/crypto";
import {
  getCurrentUser,
  getUserSessions,
  revokeAllSessions,
  revokeSession,
} from "@/lib/auth/session";
import { ChangePasswordSchema, UpdateProfileSchema } from "@/lib/validations";

type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ─── Update Profile ───────────────────────────────────────────────────────────

export async function updateProfileAction(
  _prevState: unknown,
  formData: FormData,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const raw = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string | undefined,
    dob: formData.get("dob") as string | undefined,
    gender: formData.get("gender") as string | undefined,
    bio: formData.get("bio") as string | undefined,
  };

  const parsed = UpdateProfileSchema.safeParse(raw);
  if (!parsed.success) return;

  await db
    .update(users)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  await logEvent({ userId: user.id, eventType: "profile_updated" });

  revalidatePath("/dashboard/profile");
}

// ─── Change Password ──────────────────────────────────────────────────────────

export async function changePasswordAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const raw = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = ChangePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "তথ্য যাচাই ব্যর্থ হয়েছে।",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const account = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, user.id), eq(accounts.provider, "email")),
  });

  if (!account?.passwordHash) {
    return { success: false, error: "আপনার অ্যাকাউন্টে পাসওয়ার্ড লগইন নেই।" };
  }

  const valid = await verifyPassword(
    account.passwordHash,
    parsed.data.currentPassword,
  );
  if (!valid) {
    return { success: false, error: "বর্তমান পাসওয়ার্ড ভুল।" };
  }

  const newHash = await hashPassword(parsed.data.newPassword);
  await db
    .update(accounts)
    .set({ passwordHash: newHash })
    .where(and(eq(accounts.userId, user.id), eq(accounts.provider, "email")));

  await logEvent({ userId: user.id, eventType: "password_change" });

  revalidatePath("/dashboard/security");
  return { success: true, message: "পাসওয়ার্ড পরিবর্তন সফল হয়েছে।" };
}

// ─── Revoke Specific Session ──────────────────────────────────────────────────

export async function revokeSessionAction(sessionId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await revokeSession(sessionId, user.id);
  await logEvent({
    userId: user.id,
    eventType: "session_revoked",
    details: sessionId,
  });

  revalidatePath("/dashboard/security");
}

// ─── Revoke All Sessions ──────────────────────────────────────────────────────

export async function revokeAllSessionsAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await revokeAllSessions(user.id);
  await logEvent({ userId: user.id, eventType: "all_sessions_revoked" });

  revalidatePath("/dashboard/security");
}


