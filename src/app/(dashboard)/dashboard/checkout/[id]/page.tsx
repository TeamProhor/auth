import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckoutForm } from "@/components/billing/checkout-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { PLANS } from "@/lib/constants/billing";

interface CheckoutPageProps {
  params: Promise<{ id: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const plan = PLANS[id];

  if (!plan) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/billing"
          className="size-9 rounded-xl border border-border bg-background hover:bg-accent/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon icon="solar:arrow-left-bold" width="18" height="18" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            সাবস্ক্রিপশন চেকআউট
          </h2>
          <p className="text-muted-foreground text-sm">
            আপনার সাবস্ক্রিপশন নিশ্চিত করুন এবং পেমেন্ট সম্পন্ন করুন।
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-5 items-start">
        {/* ─── Plan Summary Card ─── */}
        <Card className="md:col-span-2 p-6 space-y-6 border-primary/30 bg-primary/5">
          <div className="space-y-2">
            {plan.badge && (
              <Badge variant="default" className="text-xs font-semibold mb-1">
                {plan.badge}
              </Badge>
            )}
            <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
            <p className="text-xs text-muted-foreground">{plan.description}</p>
          </div>

          <div className="pt-4 border-t border-border/50">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-primary">
                {plan.priceFormatted}
              </span>
              <span className="text-sm text-muted-foreground">
                / {plan.period}
              </span>
            </div>
            <p className="text-xs text-emerald-500 font-medium mt-1">
              ✓ স্টোরেজ সীমা: {plan.storage}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-border/50">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              প্ল্যান সুবিধাসমূহ
            </p>
            <ul className="space-y-2">
              {plan.features.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center gap-2 text-xs font-medium text-foreground"
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
        </Card>

        {/* ─── Interactive Payment Form ─── */}
        <div className="md:col-span-3">
          <CheckoutForm plan={plan} user={user} />
        </div>
      </div>
    </div>
  );
}
