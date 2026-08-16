import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getUserInvoices, getUserSubscription } from "@/actions/billing";
import { BillingToastHandler } from "@/components/billing/billing-toast-handler";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  Card as CardIcon,
  CheckCircle,
  CrownStar,
  Danger,
  Refresh,
  ShieldAlert,
} from "@/components/icons";
import { QuickList, QuickListItem } from "@/components/shared/quick-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { PLANS } from "@/lib/constants/billing";

const PAID_PLANS = Object.values(PLANS).filter((p) => p.id !== "prohor-free");

const bnDateFormatter = new Intl.DateTimeFormat("bn", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [sub, userInvoices] = await Promise.all([
    getUserSubscription(user.id),
    getUserInvoices(user.id),
  ]);

  const subStatus = sub?.status || "active";
  const currentPlanId = sub?.planId || "prohor-free";
  const activePlan = PLANS[currentPlanId] || PLANS["prohor-free"];

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      <Suspense fallback={null}>
        <BillingToastHandler />
      </Suspense>

      {/* ─── Header ─── */}
      <DashboardHeader />

      {/* ─── Status Banners ─── */}
      {subStatus === "pending" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 shadow-xs">
          <div className="size-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Refresh size={18} className="animate-spin" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm text-foreground">
                পেমেন্ট যাচাইকরণ অপেক্ষমান
              </h4>
              <Badge
                variant="outline"
                className="text-[10px] text-amber-600 border-amber-500/40 bg-amber-500/10 font-bold"
              >
                Pending Approval
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              আপনার{" "}
              <strong className="text-foreground font-semibold">
                {activePlan.name}
              </strong>{" "}
              প্ল্যানের সাবস্ক্রিপশন অনুরোধটি জমা হয়েছে। অ্যাডমিন আপনার পেমেন্ট যাচাই ও অনুমোদন
              করার পর প্ল্যানটি অবিলম্বে সক্রিয় হবে।
            </p>
          </div>
        </div>
      )}

      {subStatus === "rejected" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-start gap-3.5 shadow-xs">
          <div className="size-9 rounded-xl bg-destructive/20 text-destructive flex items-center justify-center shrink-0 mt-0.5">
            <Danger size={18} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm text-foreground">
                পেমেন্ট যাচাইকরণ ব্যর্থ / প্রত্যাখ্যাত
              </h4>
              <Badge variant="destructive" className="text-[10px] font-bold">
                Rejected
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              আপনার পূর্ববর্তী পেমেন্ট যাচাইকরণে ব্যর্থ বা প্রত্যাখ্যাত হয়েছে।
              {sub?.rejectionReason && (
                <span className="text-foreground font-medium ml-1">
                  কারণ: {sub.rejectionReason}
                </span>
              )}{" "}
              দয়া করে সঠিক তথ্য দিয়ে পুনরায় চেষ্টা করুন।
            </p>
          </div>
        </div>
      )}

      {subStatus === "past_due" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 shadow-xs">
          <div className="size-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert size={18} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm text-foreground">
                সাবস্ক্রিপশনের মেয়াদ শেষ
              </h4>
              <Badge
                variant="outline"
                className="text-[10px] text-amber-600 border-amber-500/40 bg-amber-500/10 font-bold"
              >
                Past Due
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              আপনার বর্তমান সাবস্ক্রিপশনের মেয়াদ উত্তীর্ণ হয়েছে। নিরবচ্ছিন্ন সেবা বজায় রাখতে
              পুনরায় সাবস্ক্রাইব করুন।
            </p>
          </div>
        </div>
      )}

      {/* ─── Pricing Tier Cards ─── */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <CrownStar size={20} className="text-primary" /> উপলব্ধ প্ল্যানসমূহ
        </h3>
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PAID_PLANS.map((plan) => {
            const isPlanSelected = currentPlanId === plan.id;
            const isActiveCurrent = isPlanSelected && subStatus === "active";
            const isPendingThisPlan = isPlanSelected && subStatus === "pending";

            return (
              <Card
                key={plan.id}
                className={`p-6 flex flex-col justify-between relative overflow-visible transition-all duration-300 ${
                  isActiveCurrent
                    ? "border-primary shadow-md bg-primary/5 dark:bg-primary/10"
                    : isPendingThisPlan
                      ? "border-amber-500/60 shadow-md bg-amber-500/5 dark:bg-amber-500/10"
                      : "border-border hover:border-primary/50"
                }`}
              >
                {isActiveCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-0.5 text-xs shadow-sm">
                      বর্তমান সক্রিয় প্ল্যান
                    </Badge>
                  </div>
                )}

                {isPendingThisPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-amber-500 text-white font-semibold px-3 py-0.5 text-xs shadow-sm animate-pulse">
                      অনুমোদন অপেক্ষমান
                    </Badge>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-lg text-foreground">
                      {plan.name}
                    </h4>
                    <p className="text-muted-foreground text-xs mt-1">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-foreground">
                      {plan.priceFormatted}
                    </span>
                    <span className="text-muted-foreground text-xs font-semibold">
                      /{plan.period}
                    </span>
                  </div>

                  <hr className="border-border" />

                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle
                          size={14}
                          className="text-primary shrink-0"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isActiveCurrent ? (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full mt-6 rounded-xl font-bold text-xs"
                  >
                    সক্রিয় আছে
                  </Button>
                ) : isPendingThisPlan ? (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full mt-6 rounded-xl font-bold text-xs border-amber-500/40 text-amber-600 bg-amber-500/5"
                  >
                    অনুরোধ প্রক্রিয়াধীন
                  </Button>
                ) : (
                  <Button
                    render={
                      <Link href={`/dashboard/checkout/${plan.id}`}>
                        আপগ্রেড করুন
                      </Link>
                    }
                    className="w-full mt-6 rounded-xl font-bold text-xs cursor-pointer shadow-sm"
                  >
                    আপগ্রেড করুন
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* ─── Payment Receipts / Invoices with QuickList ─── */}
      <div className="pt-6 border-t border-border">
        <QuickList
          title="পেমেন্ট ইতিহাস (Invoices)"
          description="আপনার বিগত সকল লেনদেন এবং পেমেন্ট রসিদের তালিকা।"
          variant="list"
        >
          {userInvoices.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 text-sm bg-card border border-border/80 rounded-xl">
              কোনো পেমেন্ট হিস্ট্রি পাওয়া যায়নি।
            </div>
          ) : (
            userInvoices.map((inv) => (
              <QuickListItem
                key={inv.id}
                icon={<CardIcon size={22} />}
                color={
                  inv.status === "paid"
                    ? "emerald"
                    : inv.status === "pending"
                      ? "amber"
                      : "rose"
                }
                title={
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-foreground">
                      {inv.planName}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      ({inv.paymentMethod})
                    </span>
                    {inv.status === "paid" ? (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold px-2 py-0.5"
                      >
                        পরিশোধিত (Paid)
                      </Badge>
                    ) : inv.status === "pending" ? (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold px-2 py-0.5"
                      >
                        যাচাই অপেক্ষমান (Pending)
                      </Badge>
                    ) : (
                      <Badge
                        variant="destructive"
                        className="text-[10px] font-bold px-2 py-0.5"
                      >
                        ব্যর্থ / প্রত্যাখ্যাত (Failed)
                      </Badge>
                    )}
                  </div>
                }
                description={
                  <div className="flex flex-wrap items-center gap-x-2.5 text-xs text-muted-foreground mt-0.5">
                    <span className="font-bold text-foreground">
                      ৳{inv.amount}
                    </span>
                    <span>•</span>
                    <span>
                      {bnDateFormatter.format(new Date(inv.createdAt))}
                    </span>
                  </div>
                }
                action={
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-muted/60 dark:bg-muted/40 border border-border/60 rounded-xl px-3 py-1.5 font-bold text-xs text-foreground">
                      <span>৳{inv.amount}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      render={
                        <Link
                          href={`/print/invoice/${inv.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          রসিদ
                        </Link>
                      }
                      className="text-xs rounded-xl h-8 px-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    />
                  </div>
                }
              />
            ))
          )}
        </QuickList>
      </div>
    </div>
  );
}
