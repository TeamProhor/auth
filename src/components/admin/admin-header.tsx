"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CrownStar } from "@/components/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const BREADCRUMB_LABELS: Record<string, string> = {
  "/admin": "ওভারভিউ",
  "/admin/users": "ব্যবহারকারী ব্যবস্থাপনা",
  "/admin/subscriptions": "সাবস্ক্রিপশন ও বিলিং",
  "/admin/oauth-apps": "ওঅথ ও API কী",
  "/admin/audit-logs": "সিকিউরিটি অডিট লগ",
};

export function AdminHeader({ action }: { action?: React.ReactNode } = {}) {
  const pathname = usePathname();
  const currentLabel =
    BREADCRUMB_LABELS[pathname] ||
    (pathname.split("/").filter(Boolean).pop() ?? "");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/admin" />}
              className="flex items-center hover:opacity-80 transition-opacity"
              aria-label="অ্যাডমিন প্যানেল"
            >
              <CrownStar size={16} className="text-primary" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathname !== "/admin" && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-muted-foreground">
                  {currentLabel}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {action && (
        <div className="flex items-center gap-2 shrink-0">{action}</div>
      )}
    </div>
  );
}
