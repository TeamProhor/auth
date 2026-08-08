import { Icon } from "@iconify/react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { OAuthClient, UserConsent } from "@/db/schema";

interface ServicesGridProps {
  connectedApps: Array<{
    consent: UserConsent;
    client: OAuthClient;
  }>;
}

import { PROHOR_SERVICES } from "@/lib/constants/ui";

export function ServicesGrid({ connectedApps }: ServicesGridProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {PROHOR_SERVICES.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="p-5 hover:border-primary/50 hover:shadow-md transition-[border-color,box-shadow] group flex flex-col items-center text-center gap-3">
              <div
                className={`size-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${item.color}`}
              >
                <Icon icon={item.icon} width="32" height="32" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.desc}
                </p>
              </div>
            </Card>
          </Link>
        ))}

        <Link href="#">
          <Card className="p-5 hover:border-primary/50 hover:shadow-md transition-[border-color,box-shadow] group flex flex-col items-center text-center gap-3 bg-muted/50">
            <div className="size-14 rounded-2xl bg-background border border-border text-muted-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon icon="solar:widget-add-bold" width="32" height="32" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">আরও এক্সপ্লোর</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                নতুন সার্ভিস দেখুন
              </p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Connected Third-Party Apps */}
      {connectedApps.length > 0 && (
        <div className="pt-4 border-t border-border space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">
            সংযুক্ত অ্যাপ ({connectedApps.length}টি)
          </p>
          <div className="flex flex-wrap gap-2">
            {connectedApps.map(({ client, consent }) => (
              <div
                key={consent.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-background text-sm"
              >
                <div className="size-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-foreground">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
