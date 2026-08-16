import { AdminHeader } from "@/components/admin/admin-header";
import { OverviewMetrics } from "@/components/admin/overview-metrics";
import { getAdminOverviewStats } from "@/lib/admin-queries";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  return (
    <>
      <AdminHeader />
      <OverviewMetrics stats={stats} />
    </>
  );
}
