import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Devices, PlugCircle, StarFall } from "@/components/icons";
import type { User } from "@/db/schema";
import type { Plan } from "@/lib/constants/billing";

interface OverviewHeaderProps {
  user: User;
  stats: {
    activeSessions: number;
    connectedApps: number;
    auditEvents: number;
  };
  plan?: Plan;
}

const toBengaliNum = (n: number) =>
  n.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

export function OverviewHeader({
  user: _user,
  stats,
  plan,
}: OverviewHeaderProps) {
  const planName = plan?.nameBn || "প্রহর ফ্রি";

  return (
    <DashboardHeader
      action={
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-card border border-border px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Devices size={15} />
            {toBengaliNum(stats.activeSessions)}টি সক্রিয় সেশন
          </div>
          <div className="bg-card border border-border px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <PlugCircle size={15} />
            {toBengaliNum(stats.connectedApps)}টি অ্যাপ সংযুক্ত
          </div>
          <div className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
            <StarFall size={16} />
            {planName} মেম্বার
          </div>
        </div>
      }
    />
  );
}
