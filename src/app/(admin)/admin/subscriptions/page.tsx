import { AdminHeader } from "@/components/admin/admin-header";
import { SubscriptionList } from "@/components/admin/subscription-list";
import { getAdminSubscriptions } from "@/lib/admin-queries";

export default async function AdminSubscriptionsPage(props: {
  searchParams: Promise<{
    filter?:
      | "all"
      | "pending"
      | "active"
      | "canceled"
      | "rejected"
      | "past_due";
    search?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const filter = searchParams.filter || "all";
  const search = searchParams.search || "";
  const page = Number(searchParams.page) || 1;

  const subsResult = await getAdminSubscriptions({
    filter,
    search,
    page,
    limit: 15,
  });

  return (
    <>
      <AdminHeader />

      <SubscriptionList
        items={subsResult.items}
        total={subsResult.total}
        pendingCount={subsResult.pendingCount}
        page={subsResult.page}
        totalPages={subsResult.totalPages}
        currentFilter={filter}
        searchQuery={search}
      />
    </>
  );
}
