"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { invoices, subscriptions } from "@/db/schema";
import { logEvent } from "@/lib/auth/audit";
import { getCurrentUser } from "@/lib/auth/session";
import { PLANS } from "@/lib/constants/billing";

export async function getUserSubscription(userId: string) {
  try {
    const sub = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
    });
    return sub ?? null;
  } catch {
    return null;
  }
}

export async function getUserInvoices(userId: string) {
  try {
    return db.query.invoices.findMany({
      where: eq(invoices.userId, userId),
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    });
  } catch {
    return [];
  }
}

export async function subscribeToPlanAction(
  planId: string,
  paymentMethod: string,
) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const plan = PLANS[planId];
  if (!plan) throw new Error("অবৈধ সাবস্ক্রিপশন প্ল্যান।");

  const isFreePlan = plan.price === 0;
  const initialStatus = isFreePlan ? "active" : "pending";

  // Calculate 1 month period
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  // Check existing subscription
  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, user.id),
  });

  if (existing) {
    await db
      .update(subscriptions)
      .set({
        planId: plan.id,
        status: initialStatus,
        paymentMethod,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        updatedAt: now,
      })
      .where(eq(subscriptions.userId, user.id));
  } else {
    await db.insert(subscriptions).values({
      userId: user.id,
      planId: plan.id,
      status: initialStatus,
      paymentMethod,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    });
  }

  // Record invoice receipt if price > 0
  if (plan.price > 0) {
    await db.insert(invoices).values({
      userId: user.id,
      amount: plan.price,
      planName: plan.name,
      paymentMethod,
      status: "pending",
    });
  }

  await logEvent({
    userId: user.id,
    eventType: "profile_updated",
    details: `Subscription request: ${plan.name} (${initialStatus}) via ${paymentMethod}`,
  });

  revalidatePath("/dashboard/billing");
  revalidatePath("/admin/subscriptions");

  if (isFreePlan) {
    redirect("/dashboard/billing?subscribed=true");
  } else {
    redirect("/dashboard/billing?pending=true");
  }
}
