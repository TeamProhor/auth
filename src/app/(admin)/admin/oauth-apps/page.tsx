import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ApiKeysTable } from "@/components/admin/api-keys-table";
import { OAuthAppsTable } from "@/components/admin/oauth-apps-table";
import { getAdminApiKeys, getAdminOAuthClients } from "@/lib/admin-queries";

export default async function AdminOAuthAppsPage(props: {
  searchParams: Promise<{
    tab?: "apps" | "keys";
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const tab = searchParams.tab || "apps";
  const page = Number(searchParams.page) || 1;

  const [appsResult, keysResult] = await Promise.all([
    tab === "apps"
      ? getAdminOAuthClients({ page, limit: 15 })
      : { items: [], total: 0, page: 1, totalPages: 0 },
    tab === "keys"
      ? getAdminApiKeys({ page, limit: 15 })
      : { items: [], total: 0, page: 1, totalPages: 0 },
  ]);

  return (
    <>
      <AdminHeader
        action={
          <div className="flex items-center gap-1 bg-accent/60 p-1 rounded-xl border border-border/50">
            <Link
              href="/admin/oauth-apps?tab=apps"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === "apps"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              OAuth ক্লায়েন্ট অ্যাপস
            </Link>
            <Link
              href="/admin/oauth-apps?tab=keys"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === "keys"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              পার্সোনাল API Keys
            </Link>
          </div>
        }
      />

      {tab === "apps" ? (
        <OAuthAppsTable
          items={appsResult.items}
          total={appsResult.total}
          page={appsResult.page}
          totalPages={appsResult.totalPages}
        />
      ) : (
        <ApiKeysTable
          items={keysResult.items}
          total={keysResult.total}
          page={keysResult.page}
          totalPages={keysResult.totalPages}
        />
      )}
    </>
  );
}
