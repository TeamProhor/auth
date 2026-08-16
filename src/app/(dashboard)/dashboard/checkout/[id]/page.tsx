import { notFound, redirect } from "next/navigation";
import { CheckoutForm } from "@/components/billing/checkout-form";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CheckCircle } from "@/components/icons";
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
    <div className="max-w-5xl space-y-8 pb-12">
      <DashboardHeader />

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
                  <CheckCircle
                    size={16}
                    className="text-emerald-500 shrink-0"
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
