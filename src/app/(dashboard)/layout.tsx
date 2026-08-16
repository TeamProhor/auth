import { DashboardShell } from "@/components/shared/dashboard-shell";
import { getCurrentUser } from "@/lib/auth/session";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const defaultCollapsed = cookieStore.get("sidebar_collapsed")?.value === "true";

  return (
    <DashboardShell user={user} defaultCollapsed={defaultCollapsed}>
      {children}
    </DashboardShell>
  );
}
