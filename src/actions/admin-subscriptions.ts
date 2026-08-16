"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { invoices, subscriptions } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { getAdminUser } from "@/lib/auth/session";
import { PLANS } from "@/lib/constants/billing";

type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

export async function approveSubscriptionAction(
  userId: string,
  durationMonths: number = 1,
  customEndDate?: string,
): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "অননুমোদিত এক্সেস।" };

  const now = new Date();
  let periodEnd: Date;

  if (customEndDate) {
    periodEnd = new Date(customEndDate);
  } else {
    periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + durationMonths);
  }

  // 1. Activate subscription with enforced expiration date
  await db
    .update(subscriptions)
    .set({
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      updatedAt: now,
    })
    .where(eq(subscriptions.userId, userId));

  // 2. Mark pending invoices as paid
  await db
    .update(invoices)
    .set({
      status: "paid",
    })
    .where(and(eq(invoices.userId, userId), eq(invoices.status, "pending")));

  await logEvent({
    userId: admin.id,
    eventType: "profile_updated",
    details: `Admin approved subscription for user ${userId} until ${periodEnd.toISOString()}`,
  });

  revalidatePath("/admin/subscriptions");
  revalidatePath("/admin/users");
  revalidatePath("/dashboard/billing");
  return {
    success: true,
    message: `সাবস্ক্রিপশন সফলভাবে অনুমোদিত ও সক্রিয় করা হয়েছে (${periodEnd.toLocaleDateString("bn-BD")} পর্যন্ত বৈধ)।`,
  };
}

export async function rejectSubscriptionAction(
  userId: string,
  reason?: string,
): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "অননুমোদিত এক্সেস।" };

  const now = new Date();

  // 1. Revert subscription to free or mark as rejected
  await db
    .update(subscriptions)
    .set({
      planId: "prohor-free",
      status: "canceled",
      updatedAt: now,
    })
    .where(eq(subscriptions.userId, userId));

  // 2. Mark pending invoices as failed
  await db
    .update(invoices)
    .set({
      status: "failed",
    })
    .where(and(eq(invoices.userId, userId), eq(invoices.status, "pending")));

  await logEvent({
    userId: admin.id,
    eventType: "profile_updated",
    details: `Admin rejected subscription for user ${userId}. Reason: ${reason || "Unverified payment"}`,
  });

  revalidatePath("/admin/subscriptions");
  revalidatePath("/admin/users");
  revalidatePath("/dashboard/billing");
  return {
    success: true,
    message: "সাবস্ক্রিপশন অনুরোধটি প্রত্যাখ্যান (Rejected) করা হয়েছে।",
  };
}

export async function overrideSubscriptionAction(
  userId: string,
  planId: string,
  status:
    | "active"
    | "pending"
    | "canceled"
    | "rejected"
    | "past_due" = "active",
): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "অননুমোদিত এক্সেস।" };

  const plan = PLANS[planId];
  if (!plan) return { success: false, error: "অবৈধ সাবস্ক্রিপশন প্ল্যান।" };

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });

  if (existing) {
    await db
      .update(subscriptions)
      .set({
        planId: plan.id,
        status,
        updatedAt: now,
        currentPeriodEnd: periodEnd,
      })
      .where(eq(subscriptions.userId, userId));
  } else {
    await db.insert(subscriptions).values({
      userId,
      planId: plan.id,
      status,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    });
  }

  // If status is set to active, approve pending invoices
  if (status === "active") {
    await db
      .update(invoices)
      .set({ status: "paid" })
      .where(and(eq(invoices.userId, userId), eq(invoices.status, "pending")));
  }

  await logEvent({
    userId: admin.id,
    eventType: "profile_updated",
    details: `Admin changed subscription for user ${userId} to ${plan.name} (${status})`,
  });

  revalidatePath("/admin/subscriptions");
  revalidatePath("/admin/users");
  revalidatePath("/dashboard/billing");
  return {
    success: true,
    message: `সাবস্ক্রিপশন সফলভাবে "${plan.name}" (${status})-এ পরিবর্তন করা হয়েছে।`,
  };
}

export async function cancelUserSubscriptionAction(
  userId: string,
): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "অননুমোদিত এক্সেস।" };

  await db
    .update(subscriptions)
    .set({
      status: "canceled",
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, userId));

  await logEvent({
    userId: admin.id,
    eventType: "profile_updated",
    details: `Admin canceled subscription for user ${userId}`,
  });

  revalidatePath("/admin/subscriptions");
  revalidatePath("/admin/users");
  revalidatePath("/dashboard/billing");
  return {
    success: true,
    message: "সাবস্ক্রিপশন সফলভাবে বাতিল করা হয়েছে।",
  };
}
