import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminUser, getCurrentUser } from "@/lib/auth/session";

export const metadata = {
  title: "প্রহর অ্যাডমিন প্যানেল | Prohor Admin",
  description: "প্রহর সেন্ট্রাল অথেন্টিকেশন প্ল্যাটফর্ম অ্যাডমিন পোর্টাল",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const admin = await getAdminUser();
  if (!admin) {
    redirect("/dashboard");
  }

  const cookieStore = await cookies();
  const defaultCollapsed =
    cookieStore.get("admin_sidebar_collapsed")?.value === "true";

  return (
    <AdminShell user={admin} defaultCollapsed={defaultCollapsed}>
      {children}
    </AdminShell>
  );
}
