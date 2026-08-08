import { OverviewHeader } from "@/components/dashboard/overview-header";
import { ProfileCompletion } from "@/components/dashboard/profile-completion";
import { ServicesGrid } from "@/components/dashboard/services-grid";
import { StorageWidget } from "@/components/dashboard/storage-widget";

export default function DashboardPage() {
  return (
    <>
      <OverviewHeader />
      <ProfileCompletion />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-foreground">প্রহর সার্ভিসেস</h3>
          <ServicesGrid />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">সেন্ট্রাল স্টোরেজ</h3>
          <StorageWidget />
        </div>
      </div>
    </>
  );
}
