"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProhorLogo } from "@/components/shared/prohor-logo";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const DASHBOARD_BREADCRUMB_LABELS: Record<string, string> = {
  "/dashboard": "ওভারভিউ",
  "/dashboard/profile": "প্রোফাইল ও সেটিংস",
  "/dashboard/security": "নিরাপত্তা ও গোপনীয়তা",
  "/dashboard/billing": "প্ল্যান ও সাবস্ক্রিপশন",
  "/dashboard/oauth-keys": "ওঅথ ও এপিআই কী",
};

export function DashboardHeader({ action }: { action?: React.ReactNode } = {}) {
  const pathname = usePathname();

  const isCheckout = pathname.startsWith("/dashboard/checkout");
  const currentLabel =
    DASHBOARD_BREADCRUMB_LABELS[pathname] ||
    (isCheckout
      ? "সাবস্ক্রিপশন চেকআউট"
      : (pathname.split("/").filter(Boolean).pop() ?? ""));

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/dashboard" />}
              className="flex items-center hover:opacity-80 transition-opacity"
              aria-label="ড্যাশবোর্ড"
            >
              <ProhorLogo className="size-4.5 rounded" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          {isCheckout ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href="/dashboard/billing" />}
                  className="hover:text-primary transition-colors"
                >
                  প্ল্যান ও সাবস্ক্রিপশন
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-muted-foreground">
                  সাবস্ক্রিপশন চেকআউট
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : pathname !== "/dashboard" ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-muted-foreground">
                  {currentLabel}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : null}
        </BreadcrumbList>
      </Breadcrumb>

      {action && (
        <div className="flex items-center gap-2 shrink-0">{action}</div>
      )}
    </div>
  );
}
