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
  revokeAllSessions,
  revokeSession,
} from "@/lib/auth/session";
import {
  ChangePasswordSchema,
  SetPasswordSchema,
  UpdateProfileSchema,
} from "@/lib/validations";

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

// ─── Set Password (for OAuth / Passwordless accounts) ─────────────────────────

export async function setPasswordAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const raw = {
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = SetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "তথ্য যাচাই ব্যর্থ হয়েছে।",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existingEmailAccount = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, user.id), eq(accounts.provider, "email")),
  });

  if (existingEmailAccount?.passwordHash) {
    return {
      success: false,
      error:
        "আপনার অ্যাকাউন্টে ইতিমধ্যে পাসওয়ার্ড সেট করা আছে। পাসওয়ার্ড পরিবর্তন অপশনটি ব্যবহার করুন।",
    };
  }

  const newHash = await hashPassword(parsed.data.newPassword);

  if (existingEmailAccount) {
    await db
      .update(accounts)
      .set({ passwordHash: newHash })
      .where(and(eq(accounts.userId, user.id), eq(accounts.provider, "email")));
  } else {
    await db.insert(accounts).values({
      userId: user.id,
      provider: "email",
      providerUsername: user.email,
      passwordHash: newHash,
    });
  }

  await logEvent({
    userId: user.id,
    eventType: "password_change",
    details: "password_set",
  });

  revalidatePath("/dashboard/security");
  return { success: true, message: "পাসওয়ার্ড সফলভাবে সেট করা হয়েছে।" };
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

// ─── Connected Accounts & Unlink ─────────────────────────────────────────────

export async function getUserAccountsAction() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db.select().from(accounts).where(eq(accounts.userId, user.id));
}

export async function unlinkAccountAction(
  provider: "google" | "github",
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userAccounts = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, user.id));

  const accountToRemove = userAccounts.find((a) => a.provider === provider);
  if (!accountToRemove) {
    return { success: false, error: "এই প্রভাইডার আপনার অ্যাকাউন্টে সংযুক্ত নেই।" };
  }

  // After removal, must have at least one usable login method:
  // - email provider with a password, OR
  // - any other OAuth provider
  const remaining = userAccounts.filter((a) => a.provider !== provider);
  const hasUsableLogin = remaining.some(
    (a) =>
      a.provider === "google" || a.provider === "github" || !!a.passwordHash,
  );

  if (!hasUsableLogin) {
    return {
      success: false,
      error:
        "বিচ্ছিন্ন করার পর আপনার কোনো লগইন মাধ্যম থাকবে না। প্রথমে পাসওয়ার্ড সেট করুন বা অন্য একটি অ্যাকাউন্ট সংযুক্ত করুন।",
    };
  }

  await db
    .delete(accounts)
    .where(and(eq(accounts.userId, user.id), eq(accounts.provider, provider)));

  await logEvent({
    userId: user.id,
    eventType: "oauth_account_unlinked",
    details: `Unlinked provider: ${provider}`,
  });

  revalidatePath("/dashboard/security");
  return {
    success: true,
    message: "সংযুক্ত অ্যাকাউন্ট সফলভাবে বিচ্ছিন্ন করা হয়েছে।",
  };
}
