"use server";

import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { accounts, magicLinkTokens, users } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { hashPassword, verifyPassword } from "@/lib/auth/crypto";
import { createSession, deleteSession } from "@/lib/auth/session";
import {
  LoginSchema,
  MagicLinkSchema,
  RegisterSchema,
} from "@/lib/validations";

type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

async function getRequestMeta() {
  // headers() is async in Next.js 16
  const headersList = await headers();
  const rawIp =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    undefined;
  const ip = rawIp ? rawIp.replace(/^::ffff:/, "") : undefined;
  return {
    ip,
    userAgent: headersList.get("user-agent") ?? undefined,
  };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "তথ্য যাচাই ব্যর্থ হয়েছে।",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const { email, password } = parsed.data;
  const meta = await getRequestMeta();

  // Find user
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    await logEvent({
      eventType: "login",
      ipAddress: meta.ip,
      details: `Failed: ${email}`,
    });
    return { success: false, error: "ইমেইল বা পাসওয়ার্ড ভুল।" };
  }

  if (user.isBanned) {
    return { success: false, error: "এই অ্যাকাউন্টটি স্থগিত করা হয়েছে।" };
  }

  // Find email account
  const account = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, user.id), eq(accounts.provider, "email")),
  });

  if (!account?.passwordHash) {
    return { success: false, error: "এই অ্যাকাউন্টটিতে পাসওয়ার্ড লগইন নেই।" };
  }

  const valid = await verifyPassword(account.passwordHash, password);
  if (!valid) {
    await logEvent({
      userId: user.id,
      eventType: "login",
      ipAddress: meta.ip,
      details: "Failed: wrong password",
    });
    return { success: false, error: "ইমেইল বা পাসওয়ার্ড ভুল।" };
  }

  await createSession(user.id, meta);
  await logEvent({
    userId: user.id,
    eventType: "login",
    ipAddress: meta.ip,
    details: "Success",
  });

  redirect("/dashboard");
}

// ─── Register ─────────────────────────────────────────────────────────────────

export async function registerAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "তথ্য যাচাই ব্যর্থ হয়েছে।",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const { name, email, password } = parsed.data;
  const meta = await getRequestMeta();

  // Check for existing user
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    return { success: false, error: "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে।" };
  }

  const passwordHash = await hashPassword(password);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({ name, email })
    .returning({ id: users.id });

  if (!newUser) {
    return { success: false, error: "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে।" };
  }

  // Create email account record
  await db.insert(accounts).values({
    userId: newUser.id,
    provider: "email",
    passwordHash,
  });

  await createSession(newUser.id, meta);
  await logEvent({
    userId: newUser.id,
    eventType: "register",
    ipAddress: meta.ip,
  });

  redirect("/dashboard");
}

// ─── Magic Link Request ───────────────────────────────────────────────────────

export async function requestMagicLinkAction(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const raw = { email: formData.get("email") as string };

  const parsed = MagicLinkSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "একটি বৈধ ইমেইল দিন।" };
  }

  const { email } = parsed.data;
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Delete old tokens for this email
  await db.delete(magicLinkTokens).where(eq(magicLinkTokens.email, email));

  // Save new token
  await db.insert(magicLinkTokens).values({ email, token, expiresAt });

  // Send magic link email (logs to console in dev if RESEND_API_KEY not set)
  const { sendMagicLinkEmail } = await import("@/lib/email");
  const result = await sendMagicLinkEmail({
    to: email,
    token,
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  });

  if (!result.success) {
    // Delete the token we just created since the email failed
    await db.delete(magicLinkTokens).where(eq(magicLinkTokens.token, token));
    return { success: false, error: "ইমেইল পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" };
  }

  await logEvent({ eventType: "magic_link_sent", details: email });

  return {
    success: true,
    message: "ম্যাজিক লিংক পাঠানো হয়েছে! আপনার ইমেইল চেক করুন।",
  };
}

// ─── Magic Link Verify ────────────────────────────────────────────────────────

export async function verifyMagicLinkAction(
  token: string,
): Promise<ActionResult> {
  const meta = await getRequestMeta();

  const record = await db.query.magicLinkTokens.findFirst({
    where: eq(magicLinkTokens.token, token),
  });

  if (!record || record.expiresAt < new Date()) {
    return { success: false, error: "লিংকটি অকার্যকর বা মেয়াদোত্তীর্ণ।" };
  }

  // Delete token immediately (one-time use)
  await db.delete(magicLinkTokens).where(eq(magicLinkTokens.token, token));

  // Find or create user
  let user = await db.query.users.findFirst({
    where: eq(users.email, record.email),
  });

  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({ name: record.email.split("@")[0], email: record.email })
      .returning();

    if (!newUser)
      return { success: false, error: "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে।" };

    await db.insert(accounts).values({
      userId: newUser.id,
      provider: "email",
    });

    user = newUser;
    await logEvent({
      userId: user.id,
      eventType: "register",
      ipAddress: meta.ip,
      details: "via magic link",
    });
  }

  if (user.isBanned) {
    return { success: false, error: "এই অ্যাকাউন্টটি স্থগিত করা হয়েছে।" };
  }

  await createSession(user.id, meta);
  await logEvent({
    userId: user.id,
    eventType: "login",
    ipAddress: meta.ip,
    details: "via magic link",
  });

  redirect("/dashboard");
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const { getCurrentUser } = await import("@/lib/auth/session");
  const user = await getCurrentUser();

  await deleteSession();

  if (user) {
    await logEvent({ userId: user.id, eventType: "logout" });
  }

  redirect("/login");
}
