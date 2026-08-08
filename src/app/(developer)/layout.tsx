import { DashboardShell } from "@/components/shared/dashboard-shell";

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
