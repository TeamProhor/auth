import { redirect } from "next/navigation";
import { DeveloperUsersContent } from "@/components/developer/developer-users-content";
import { getCurrentUser } from "@/lib/auth/session";
import { getDeveloperUsers } from "@/lib/queries";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const PAGE_SIZE = 20;

  const { users, total, apps } = await getDeveloperUsers(
    user.id,
    PAGE_SIZE,
    (page - 1) * PAGE_SIZE,
  );

  return (
    <DeveloperUsersContent
      users={users}
      total={total}
      apps={apps}
      page={page}
      pageSize={PAGE_SIZE}
    />
  );
}
