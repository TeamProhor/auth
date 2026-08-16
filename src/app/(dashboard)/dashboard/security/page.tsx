import { redirect } from "next/navigation";
import type { ComponentType } from "react";
import { Suspense } from "react";
import { revokeAppAccessAction } from "@/actions/oauth";
import {
  getUserAccountsAction,
  revokeAllSessionsAction,
  revokeSessionAction,
} from "@/actions/user";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MaskedIpAddress } from "@/components/dashboard/masked-ip";
import { CloudDownload, Laptop, Mobile, Tablet } from "@/components/icons";
import { ConnectedAccountsSection } from "@/components/security/connected-accounts-section";
import { PasswordChangeSection } from "@/components/security/password-change-dialog";
import { SecurityToastHandler } from "@/components/security/security-toast-handler";
import { TwoFactorSection } from "@/components/security/two-factor-section";
import { QuickList, QuickListItem } from "@/components/shared/quick-list";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser, getUserSessions } from "@/lib/auth/session";
import { getConnectedApps } from "@/lib/queries";

const bnDateTimeFormatter = new Intl.DateTimeFormat("bn", {
  dateStyle: "medium",
  timeStyle: "short",
});

function getDeviceIcon(
  userAgent: string | null,
): ComponentType<{ size?: number | string; className?: string }> {
  if (!userAgent) return Laptop;
  const ua = userAgent.toLowerCase();
  if (ua.includes("iphone") || ua.includes("android")) return Mobile;
  if (ua.includes("ipad") || ua.includes("tablet")) return Tablet;
  return Laptop;
}

function parseUserAgent(ua: string | null): string {
  if (!ua) return "অজানা ডিভাইস";
  if (ua.includes("iPhone")) return "iPhone - Safari";
  if (ua.includes("Android")) return "Android - Chrome";
  if (ua.includes("Mac"))
    return `Mac OS - ${ua.includes("Firefox") ? "Firefox" : "Chrome"}`;
  if (ua.includes("Windows"))
    return `Windows - ${ua.includes("Firefox") ? "Firefox" : "Chrome"}`;
  return "Unknown Device";
}

const LINK_MESSAGES: Record<
  string,
  { type: "success" | "error"; text: string }
> = {
  github_linked: {
    type: "success",
    text: "GitHub অ্যাকাউন্ট সফলভাবে সংযুক্ত হয়েছে।",
  },
  google_linked: {
    type: "success",
    text: "Google অ্যাকাউন্ট সফলভাবে সংযুক্ত হয়েছে।",
  },
  link_state_invalid: {
    type: "error",
    text: "লিংক অনুরোধের মেয়াদ শেষ হয়েছে বা ইতিমধ্যে ব্যবহার করা হয়েছে। আবার চেষ্টা করুন।",
  },
  provider_already_linked: {
    type: "error",
    text: "এই Google/GitHub অ্যাকাউন্টটি ইতিমধ্যে অন্য একটি Prohor অ্যাকাউন্টে সংযুক্ত আছে।",
  },
};

interface SecurityPageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function SecurityPage({
  searchParams,
}: SecurityPageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (!user) redirect("/login");

  const feedbackKey = params.success ?? params.error;
  const _feedback = feedbackKey ? LINK_MESSAGES[feedbackKey] : null;

  const [activeSessions, userAccounts, connectedApps] = await Promise.all([
    getUserSessions(user.id),
    getUserAccountsAction(),
    getConnectedApps(user.id),
  ]);

  const hasPassword = userAccounts.some(
    (a) => a.provider === "email" && Boolean(a.passwordHash),
  );

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      <Suspense fallback={null}>
        <SecurityToastHandler />
      </Suspense>

      {/* ─── Page Header ─── */}
      <DashboardHeader />

      {/* ─── Password & 2FA ─── */}
      <div className="grid gap-6 md:grid-cols-2">
        <PasswordChangeSection hasPassword={hasPassword} />
        <TwoFactorSection twoFactorEnabled={user.twoFactorEnabled} />
      </div>

      {/* ─── Connected Social Accounts ─── */}
      <ConnectedAccountsSection userAccounts={userAccounts} />

      {/* ─── Third-Party App Access ─── */}
      <QuickList
        title={`থার্ড-পার্টি অ্যাপ অ্যাক্সেস (${connectedApps.length}টি সংযুক্ত)`}
        description="যেসব অ্যাপ্লিকেশনকে আপনার অ্যাকাউন্টের অ্যাক্সেস দেওয়া হয়েছে।"
        variant="list"
      >
        {connectedApps.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm bg-card border border-border/80 rounded-xl">
            কোনো থার্ড-পার্টি অ্যাপের অ্যাক্সেস দেওয়া নেই।
          </div>
        ) : (
          connectedApps.map(({ consent, client }) => (
            <QuickListItem
              key={consent.id}
              icon={
                <Avatar className="size-8">
                  <AvatarFallback className="bg-accent font-bold text-foreground text-xs">
                    {client.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              }
              color="purple"
              title={client.name}
              description={consent.scopes?.join(", ") ?? "বেসিক প্রোফাইল"}
              action={
                <form
                  action={revokeAppAccessAction.bind(null, client.clientId)}
                >
                  <SubmitButton
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs cursor-pointer border-destructive/20 h-8 px-3"
                  >
                    অ্যাক্সেস বাতিল
                  </SubmitButton>
                </form>
              }
            />
          ))
        )}
      </QuickList>

      {/* ─── Active Device Sessions ─── */}
      <QuickList
        title={`আপনার ডিভাইস সমূহ (${activeSessions.length}টি সক্রিয়)`}
        description="বর্তমানে কোন কোন ডিভাইসে আপনার অ্যাকাউন্ট লগইন করা আছে তা দেখুন এবং পরিচালনা করুন।"
        variant="list"
        headerAction={
          activeSessions.length > 1 ? (
            <form action={revokeAllSessionsAction}>
              <SubmitButton
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 cursor-pointer text-xs"
              >
                সব ডিভাইস থেকে লগআউট
              </SubmitButton>
            </form>
          ) : undefined
        }
      >
        {activeSessions.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 text-sm bg-card border border-border/80 rounded-xl">
            কোনো সক্রিয় সেশন নেই।
          </div>
        ) : (
          activeSessions.map((session) => {
            const DeviceIcon = getDeviceIcon(session.userAgent);
            return (
              <QuickListItem
                key={session.id}
                icon={<DeviceIcon size={22} />}
                color={session.isCurrent ? "primary" : "muted"}
                title={
                  <div className="flex items-center gap-2">
                    <span>{parseUserAgent(session.userAgent)}</span>
                    {session.isCurrent && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 text-[11px] px-2 py-0.5 font-medium"
                      >
                        বর্তমান ডিভাইস
                      </Badge>
                    )}
                  </div>
                }
                description={
                  <div className="flex flex-wrap items-center gap-x-2.5 text-xs text-muted-foreground mt-0.5">
                    <MaskedIpAddress ip={session.ipAddress} />
                    <span>•</span>
                    <span>
                      {bnDateTimeFormatter.format(new Date(session.createdAt))}
                    </span>
                  </div>
                }
                action={
                  session.isCurrent ? null : (
                    <form action={revokeSessionAction.bind(null, session.id)}>
                      <SubmitButton
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs cursor-pointer border-destructive/20 h-8"
                      >
                        লগআউট করুন
                      </SubmitButton>
                    </form>
                  )
                }
              />
            );
          })
        )}
      </QuickList>

      {/* ─── Data & Account Management ─── */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-xl font-bold text-foreground">
          ডেটা ও অ্যাকাউন্ট পরিচালনা
        </h3>

        <Card className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-border/80">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary">
              <CloudDownload size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">
                আপনার ডেটা ডাউনলোড করুন (Takeout)
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                প্রহর প্ল্যাটফর্মে থাকা আপনার সমস্ত তথ্যের একটি জিপ আর্কাইভ তৈরি করুন।
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-xl text-xs font-semibold shrink-0 cursor-pointer h-9 px-4"
          >
            আর্কাইভ তৈরি করুন
          </Button>
        </Card>

        <Card className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-destructive/30 bg-destructive/5">
          <div>
            <h4 className="font-bold text-sm text-destructive">
              অ্যাকাউন্ট মুছে ফেলুন
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              আপনার সমস্ত ডেটা ও সক্রিয় সার্ভিস স্থায়ীভাবে মুছে ফেলা হবে।
            </p>
          </div>
          <Button
            variant="destructive"
            className="rounded-xl text-xs font-semibold shrink-0 cursor-pointer h-9 px-4"
          >
            ডিলিট অ্যাকাউন্ট
          </Button>
        </Card>
      </div>
    </div>
  );
}
