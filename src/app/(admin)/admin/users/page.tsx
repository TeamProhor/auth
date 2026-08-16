import { AdminHeader } from "@/components/admin/admin-header";
import { UserList } from "@/components/admin/user-list";
import { getAdminUsers } from "@/lib/admin-queries";

export default async function AdminUsersPage(props: {
  searchParams: Promise<{
    search?: string;
    filter?: "all" | "admin" | "banned" | "unverified" | "verified";
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const filter = searchParams.filter || "all";
  const page = Number(searchParams.page) || 1;

  const result = await getAdminUsers({
    search,
    filter,
    page,
    limit: 15,
  });

  return (
    <>
      <AdminHeader />
      <UserList
        users={result.users}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
        currentFilter={filter}
        searchQuery={search}
      />
    </>
  );
}
