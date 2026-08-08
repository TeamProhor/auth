import { redirect } from "next/navigation";
import { OverviewHeader } from "@/components/dashboard/overview-header";
import { ProfileCompletion } from "@/components/dashboard/profile-completion";
import { ServicesGrid } from "@/components/dashboard/services-grid";
import { StorageWidget } from "@/components/dashboard/storage-widget";
import { getCurrentUser } from "@/lib/auth/session";
import { getConnectedApps, getDashboardStats } from "@/lib/queries";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [stats, connectedApps] = await Promise.all([
    getDashboardStats(user.id),
    getConnectedApps(user.id),
  ]);

  // Compute profile completion score
  const fields = [
    user.name,
    user.email,
    user.emailVerified,
    user.avatarUrl,
    user.phone,
    user.dob,
    user.bio,
  ];
  const completed = fields.filter(Boolean).length;
  const completionPct = Math.round((completed / fields.length) * 100);

  return (
    <>
      <OverviewHeader user={user} stats={stats} />
      <ProfileCompletion completionPct={completionPct} user={user} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-foreground">প্রহর সার্ভিসেস</h3>
          <ServicesGrid connectedApps={connectedApps} />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">সেন্ট্রাল স্টোরেজ</h3>
          <StorageWidget />
        </div>
      </div>
    </>
  );
}
