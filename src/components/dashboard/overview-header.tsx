import { Icon } from "@iconify/react";
import type { User } from "@/db/schema";

interface OverviewHeaderProps {
  user: User;
  stats: {
    activeSessions: number;
    connectedApps: number;
    auditEvents: number;
  };
}

const toBengaliNum = (n: number) =>
  n.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

export function OverviewHeader({ user, stats }: OverviewHeaderProps) {
  const firstName = user.name.split(" ")[0];

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          স্বাগতম, {firstName} 👋
        </h2>
        <p className="text-muted-foreground text-sm">
          আপনার প্রহর ইকোসিস্টেমের সবকিছু এক নজরে দেখে নিন।
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <Icon icon="solar:devices-bold" width="16" height="16" />
          {toBengaliNum(stats.activeSessions)}টি সক্রিয় সেশন
        </div>
        <div className="bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <Icon icon="solar:plug-circle-bold" width="16" height="16" />
          {toBengaliNum(stats.connectedApps)}টি অ্যাপ সংযুক্ত
        </div>
        <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Icon
            icon="solar:star-fall-minimalistic-2-bold"
            width="18"
            height="18"
          />
          প্রহর প্রো মেম্বার
        </div>
      </div>
    </div>
  );
}
