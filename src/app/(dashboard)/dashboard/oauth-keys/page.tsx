import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { OAuthKeysManager } from "@/components/dashboard/oauth-keys-manager";
import { OidcQuickList } from "@/components/dashboard/oidc-quick-list";
import { db } from "@/db";
import { oauthClients, personalApiKeys } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";

export default async function OAuthKeysPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [myApps, myKeys] = await Promise.all([
    db.select().from(oauthClients).where(eq(oauthClients.ownerId, user.id)),
    db
      .select()
      .from(personalApiKeys)
      .where(eq(personalApiKeys.userId, user.id)),
  ]);

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      {/* ─── Header ─── */}
      <DashboardHeader />

      {/* ─── Interactive Apps and API Keys Manager ─── */}
      <OAuthKeysManager initialApps={myApps} initialKeys={myKeys} />

      {/* ─── OIDC Configuration Endpoints with QuickList ─── */}
      <OidcQuickList />
    </div>
  );
}
