import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { InvoicePrintActions } from "@/components/billing/invoice-print-actions";
import { ShieldCheck } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { invoices, users } from "@/db/schema";
import { formatDateTime } from "@/lib/utils";

export default async function PrintableInvoicePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const result = await db
    .select({
      invoice: invoices,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
      },
    })
    .from(invoices)
    .innerJoin(users, eq(invoices.userId, users.id))
    .where(eq(invoices.id, id))
    .limit(1);

  if (result.length === 0) {
    notFound();
  }

  const { invoice, user } = result[0];
  const invoiceNumber = `INV-${invoice.id.replace(/-/g, "").slice(0, 10).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Top Floating Actions Bar (Hidden when printed) */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/80 shadow-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">
              অফিসিয়াল ইনভয়েস রসিদ
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">
              #{invoiceNumber}
            </Badge>
          </div>
          <InvoicePrintActions />
        </div>

        {/* Printable Invoice Paper Sheet */}
        <div className="bg-card print:bg-white border border-border/80 print:border-none rounded-3xl p-8 sm:p-12 shadow-sm print:shadow-none flex flex-col gap-8 text-foreground print:text-black">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-border/60 pb-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-xl bg-primary text-primary-foreground font-black flex items-center justify-center text-xl shadow-xs print:border print:border-black">
                  P
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-tight text-foreground print:text-black">
                    PROHOR ACCOUNTS
                  </span>
                  <span className="text-[11px] text-muted-foreground print:text-gray-600">
                    accounts.prohor.dev • সিকিউর সেন্ট্রাল আইডি
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground print:text-gray-600 max-w-xs mt-2 leading-relaxed">
                প্রহর অথেনটিকেশন ও সাবস্ক্রিপশন সার্ভিসেস প্ল্যাটফর্ম
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end text-left sm:text-right gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-gray-600">
                পেমেন্ট রসিদ / ইনভয়েস
              </span>
              <span className="text-lg font-mono font-bold text-foreground print:text-black">
                #{invoiceNumber}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs text-muted-foreground print:text-gray-600">
                  ইস্যু তারিখ:
                </span>
                <span className="text-xs font-semibold text-foreground print:text-black">
                  {formatDateTime(invoice.createdAt)}
                </span>
              </div>
              <div className="mt-1">
                {invoice.status === "paid" ? (
                  <Badge className="bg-emerald-600 text-white text-xs font-bold px-3 py-0.5 print:border print:border-emerald-600">
                    পরিশোধিত (PAID)
                  </Badge>
                ) : invoice.status === "pending" ? (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 text-amber-600 border-amber-500/50 text-xs font-bold px-3 py-0.5"
                  >
                    যাচাই অপেক্ষমান (PENDING)
                  </Badge>
                ) : (
                  <Badge
                    variant="destructive"
                    className="text-xs font-bold px-3 py-0.5"
                  >
                    ব্যর্থ / বাতিল (FAILED)
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Billed To / Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-2">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-gray-600">
                গ্রাহক বিবরণ (Billed To):
              </span>
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-base font-bold text-foreground print:text-black">
                  {user.name}
                </span>
                <span className="text-muted-foreground print:text-gray-700">
                  {user.email}
                </span>
                {user.phone && (
                  <span className="text-muted-foreground print:text-gray-700">
                    ফোন: {user.phone}
                  </span>
                )}
                <span className="text-[11px] font-mono text-muted-foreground/80 print:text-gray-500 mt-1">
                  ইউজার আইডি: {user.id}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end text-left sm:text-right gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground print:text-gray-600">
                পেমেন্ট মাধ্যম (Payment Info):
              </span>
              <div className="flex flex-col sm:items-end gap-1 text-xs">
                <span className="font-semibold text-foreground print:text-black">
                  মেথড: {invoice.paymentMethod}
                </span>
                <span className="text-muted-foreground print:text-gray-700">
                  মুদ্রা: BDT (বাংলাদেশী টাকা ৳)
                </span>
                <span className="text-[11px] text-muted-foreground/80 print:text-gray-500">
                  ইনভয়েস রেফারেন্স: {invoice.id}
                </span>
              </div>
            </div>
          </div>

          {/* Table / Line Items */}
          <div className="flex flex-col rounded-2xl border border-border/80 print:border-gray-300 overflow-hidden">
            <div className="bg-muted/50 print:bg-gray-100 p-4 grid grid-cols-12 text-xs font-bold text-muted-foreground print:text-black border-b border-border/60 print:border-gray-300">
              <div className="col-span-6">আইটেমের বিবরণ</div>
              <div className="col-span-3 text-center">মেয়াদকাল</div>
              <div className="col-span-3 text-right">পরিমাণ (৳)</div>
            </div>

            <div className="p-4 grid grid-cols-12 text-xs items-center bg-card print:bg-white">
              <div className="col-span-6 flex flex-col gap-0.5">
                <span className="font-bold text-sm text-foreground print:text-black">
                  {invoice.planName} মেম্বারশিপ সাবস্ক্রিপশন
                </span>
                <span className="text-[11px] text-muted-foreground print:text-gray-600">
                  প্রহর অ্যাকাউন্টস প্রিমিয়াম সার্ভিস ও সেন্ট্রাল ডেটা অ্যাক্সেস
                </span>
              </div>
              <div className="col-span-3 text-center text-muted-foreground print:text-gray-700">
                ১ মাস
              </div>
              <div className="col-span-3 text-right font-bold text-sm text-foreground print:text-black">
                ৳{invoice.amount.toLocaleString("bn-BD")}
              </div>
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="flex flex-col sm:items-end border-t border-border/60 pt-4">
            <div className="w-full sm:w-64 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground print:text-gray-700">
                <span>সাবটোটাল (Subtotal):</span>
                <span className="font-semibold text-foreground print:text-black">
                  ৳{invoice.amount.toLocaleString("bn-BD")}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground print:text-gray-700">
                <span>ভ্যাট / ট্যাক্স (০%):</span>
                <span className="font-semibold text-foreground print:text-black">
                  ৳০
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-extrabold border-t border-border/60 pt-2 text-foreground print:text-black">
                <span>সর্বমোট (Total Paid):</span>
                <span>৳{invoice.amount.toLocaleString("bn-BD")}</span>
              </div>
            </div>
          </div>

          {/* Footer Note & Official Seal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border/60 text-[11px] text-muted-foreground print:text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={16}
                className="text-primary print:text-black shrink-0"
              />
              <span>
                এটি একটি কম্পিউটার জেনারেটেড ডিজিটাল রসিদ। কোনো স্বাক্ষরের প্রয়োজন নেই।
              </span>
            </div>
            <div className="font-mono text-[10px] text-right text-muted-foreground/70 print:text-gray-500">
              auth.prohor.dev • Verify: {invoice.id.slice(0, 12)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
