import { redirect } from "next/navigation";
import { DeveloperApplyCard } from "@/components/developer/developer-apply-card";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (!user.isDeveloper) {
    return (
      <DashboardShell user={user}>
        <DeveloperApplyCard user={user} />
      </DashboardShell>
    );
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
