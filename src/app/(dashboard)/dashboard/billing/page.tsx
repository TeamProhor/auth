import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserInvoices, getUserSubscription } from "@/actions/billing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser } from "@/lib/auth/session";
import { PLANS } from "@/lib/constants/billing";

const PAID_PLANS = Object.values(PLANS).filter((p) => p.id !== "prohor-free");

const bnDateFormatter = new Intl.DateTimeFormat("bn", {
  dateStyle: "medium",
  timeStyle: "short",
});

interface BillingPageProps {
  searchParams: Promise<{ subscribed?: string }>;
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const [user, { subscribed }] = await Promise.all([
    getCurrentUser(),
    searchParams,
  ]);
  if (!user) redirect("/login");
  const [subscription, userInvoices] = await Promise.all([
    getUserSubscription(user.id),
    getUserInvoices(user.id),
  ]);

  const currentPlanId = subscription?.planId ?? "prohor-free";
  const currentPlan = PLANS[currentPlanId] ?? PLANS["prohor-free"];

  return (
    <div className="max-w-5xl space-y-10 pb-12">
      {/* ─── Header ─── */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          পেমেন্ট ও ফ্যামিলি
        </h2>
        <p className="text-muted-foreground text-sm">
          আপনার সাবস্ক্রিপশন প্ল্যান নির্বাচন করুন এবং ইনভয়েস হিস্ট্রি চেক করুন।
        </p>
      </div>

      {subscribed && (
        <Card className="p-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-500 flex items-center gap-3">
          <Icon icon="solar:check-circle-bold" width="20" height="20" />
          <p className="text-sm font-semibold">
            অভিনন্দন! আপনার সাবস্ক্রিপশন সফলভাবে আপডেট করা হয়েছে।
          </p>
        </Card>
      )}

      {/* ─── Active Subscription Overview ─── */}
      <Card className="p-6 md:p-8 border-primary/30 bg-primary/5 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Icon icon="solar:crown-star-bold" width="16" height="16" /> বর্তমান
              সক্রিয় প্ল্যান
            </span>
            <Badge variant="default" className="text-xs">
              {subscription?.status === "active" ? "সক্রিয়" : "ফ্রি"}
            </Badge>
          </div>
          <h3 className="text-3xl font-extrabold text-foreground">
            {currentPlan.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            স্টোরেজ সীমা:{" "}
            <span className="font-semibold text-foreground">
              {currentPlan.storage}
            </span>{" "}
            | পেমেন্ট মাধ্যম:{" "}
            <span className="font-mono text-foreground">
              {subscription?.paymentMethod ?? "N/A"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            render={<Link href="#plans" />}
            nativeButton={false}
            className="w-full md:w-auto rounded-xl border-primary text-primary hover:bg-primary hover:text-primary-foreground py-6 px-6 text-sm font-semibold cursor-pointer"
          >
            প্ল্যান পরিবর্তন করুন
          </Button>
        </div>
      </Card>

      {/* ─── Plans Grid ─── */}
      <div id="plans" className="space-y-4">
        <h3 className="text-xl font-bold text-foreground">
          উপলব্ধ সাবস্ক্রিপশন প্ল্যানসমূহ
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          {PAID_PLANS.map((plan) => {
            const isCurrent = currentPlanId === plan.id;
              return (
                <Card
                  key={plan.id}
                  className={`p-6 flex flex-col justify-between space-y-6 relative transition-all ${plan.color}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold text-foreground">
                        {plan.name}
                      </h4>
                      {plan.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {plan.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-foreground">
                        {plan.priceFormatted}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        / {plan.period}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {plan.description}
                    </p>

                    <ul className="space-y-2 pt-2 border-t border-border/50">
                      {plan.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-center gap-2 text-xs text-foreground"
                        >
                          <Icon
                            icon="solar:check-circle-bold"
                            className="size-4 text-emerald-500 shrink-0"
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isCurrent ? (
                    <Button
                      disabled
                      className="w-full rounded-xl py-6 text-sm font-semibold"
                    >
                      বর্তমান প্ল্যান
                    </Button>
                  ) : (
                    <Button
                      render={<Link href={`/dashboard/checkout/${plan.id}`} />}
                      nativeButton={false}
                      className="w-full rounded-xl py-6 text-sm font-semibold cursor-pointer"
                    >
                      আপগ্রেড করুন
                    </Button>
                  )}
                </Card>
              );
            })}
        </div>
      </div>

      {/* ─── Payment Receipts / Invoices Table ─── */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-xl font-bold text-foreground">
          পেমেন্ট ইতিহাস (Invoices)
        </h3>
        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>তারিখ</TableHead>
                <TableHead>প্ল্যান</TableHead>
                <TableHead>পেমেন্ট পদ্ধতি</TableHead>
                <TableHead>পরিমাণ</TableHead>
                <TableHead className="text-right">স্ট্যাটাস</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userInvoices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    কোনো পেমেন্ট হিস্ট্রি পাওয়া যায়নি।
                  </TableCell>
                </TableRow>
              ) : (
                userInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {bnDateFormatter.format(new Date(inv.createdAt))}
                    </TableCell>
                    <TableCell className="font-bold text-sm text-foreground">
                      {inv.planName}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {inv.paymentMethod}
                    </TableCell>
                    <TableCell className="font-bold text-sm text-foreground">
                      ৳{inv.amount}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-500"
                      >
                        {inv.status === "paid" ? "পরিশোধিত" : inv.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
