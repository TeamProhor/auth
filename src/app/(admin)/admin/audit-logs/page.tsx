import { AdminHeader } from "@/components/admin/admin-header";
import { AuditLogsTable } from "@/components/admin/audit-logs-table";
import { getAdminAuditLogs } from "@/lib/admin-queries";

export default async function AdminAuditLogsPage(props: {
  searchParams: Promise<{
    type?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const eventType = searchParams.type || "";
  const search = searchParams.search || "";
  const page = Number(searchParams.page) || 1;

  const result = await getAdminAuditLogs({
    eventType,
    search,
    page,
    limit: 25,
  });

  return (
    <>
      <AdminHeader />
      <AuditLogsTable
        items={result.items}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
        currentType={eventType}
        searchQuery={search}
      />
    </>
  );
}
