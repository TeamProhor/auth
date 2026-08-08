import { redirect } from "next/navigation";
import { getMyApps } from "@/actions/developer";
import { getCurrentUser } from "@/lib/auth/session";
import { AppsPageClient } from "./apps-client";

export default async function AppsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const apps = await getMyApps();

  return <AppsPageClient apps={apps} />;
}
