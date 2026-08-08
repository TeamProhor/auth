import { DashboardShell } from "@/components/shared/dashboard-shell";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
