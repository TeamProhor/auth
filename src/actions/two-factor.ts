"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";
import { db } from "@/db";
import { users } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { createSession, getCurrentUser } from "@/lib/auth/session";

async function getRequestMeta() {
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

// ─── Generate 2FA Secret & QR Code ───

export async function generate2FASetupAction() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const secret = generateSecret();
  const otpauth = generateURI({
    issuer: "Prohor Auth",
    label: user.email,
    secret,
  });
  const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

  return {
    success: true,
    secret,
    qrCodeDataUrl,
  };
}

// ─── Enable 2FA ───

export async function enable2FAAction(secret: string, token: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { valid } = await verify({ token: token.trim(), secret });
  if (!valid) {
    return { success: false, error: "ভুল অথবা মেয়াদোত্তীর্ণ কোড। আবার চেষ্টা করুন।" };
  }

  await db
    .update(users)
    .set({
      totpSecret: secret,
      twoFactorEnabled: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  await logEvent({
    userId: user.id,
    eventType: "profile_updated",
    details: "2FA Enabled",
  });

  revalidatePath("/dashboard/security");
  return { success: true };
}

// ─── Disable 2FA ───

export async function disable2FAAction(token: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (!user.totpSecret) {
    return { success: false, error: "2FA নিষ্ক্রিয় করা সম্ভব নয়।" };
  }

  const { valid } = await verify({
    token: token.trim(),
    secret: user.totpSecret,
  });

  if (!valid) {
    return { success: false, error: "ভুল অথবা মেয়াদোত্তীর্ণ কোড।" };
  }

  await db
    .update(users)
    .set({
      totpSecret: null,
      twoFactorEnabled: false,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  await logEvent({
    userId: user.id,
    eventType: "profile_updated",
    details: "2FA Disabled",
  });

  revalidatePath("/dashboard/security");
  return { success: true };
}

// ─── Verify 2FA on Login ───

export async function verify2FALoginAction(userId: string, token: string) {
  const meta = await getRequestMeta();

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user?.totpSecret || !user.twoFactorEnabled) {
    return { success: false, error: "অবৈধ ব্যবহারকারী অথবা 2FA সক্রিয় নয়।" };
  }

  const { valid } = await verify({
    token: token.trim(),
    secret: user.totpSecret,
  });

  if (!valid) {
    return { success: false, error: "ভুল অথবা মেয়াদোত্তীর্ণ ২FA কোড।" };
  }

  await createSession(user.id, meta);
  await logEvent({
    userId: user.id,
    eventType: "login",
    ipAddress: meta.ip,
    details: "Success via 2FA",
  });

  redirect("/dashboard");
}
