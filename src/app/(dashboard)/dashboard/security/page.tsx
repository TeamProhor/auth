import { redirect } from "next/navigation";
import type { ComponentType } from "react";
import { Suspense } from "react";
import {
  getUserAccountsAction,
  revokeAllSessionsAction,
  revokeSessionAction,
} from "@/actions/user";
import { MaskedIpAddress } from "@/components/dashboard/masked-ip";
import { Laptop, Mobile, Tablet } from "@/components/icons";
import { ConnectedAccountsSection } from "@/components/security/connected-accounts-section";
import { PasswordChangeSection } from "@/components/security/password-change-dialog";
import { SecurityToastHandler } from "@/components/security/security-toast-handler";
import { TwoFactorSection } from "@/components/security/two-factor-section";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser, getUserSessions } from "@/lib/auth/session";

const relativeTimeFormatter = new Intl.RelativeTimeFormat("bn", {
  numeric: "auto",
});
const bnDateTimeFormatter = new Intl.DateTimeFormat("bn", {
  dateStyle: "medium",
  timeStyle: "short",
});

function _formatDate(date: Date): string {
  return relativeTimeFormatter.format(
    Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    "day",
  );
}

function getDeviceIcon(
  userAgent: string | null,
): ComponentType<{ size?: number | string; className?: string }> {
  if (!userAgent) return Laptop;
  const ua = userAgent.toLowerCase();
  if (ua.includes("iphone") || ua.includes("android")) return Mobile;
  if (ua.includes("ipad") || ua.includes("tablet")) return Tablet;
  return Laptop;
}

function _formatIp(ip: string | null): string {
  if (!ip) return "অজানা";
  const cleaned = ip.replace(/^::ffff:/, "");
  if (cleaned === "::1") return "127.0.0.1";
  return cleaned;
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
  github_linked: { type: "success", text: "GitHub অ্যাকাউন্ট সফলভাবে সংযুক্ত হয়েছে।" },
  google_linked: { type: "success", text: "Google অ্যাকাউন্ট সফলভাবে সংযুক্ত হয়েছে।" },
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

  const [activeSessions, userAccounts] = await Promise.all([
    getUserSessions(user.id),
    getUserAccountsAction(),
  ]);

  const _linkedProviders = userAccounts.map((a) => a.provider);

  return (
    <div className="max-w-5xl space-y-8">
      <Suspense fallback={null}>
        <SecurityToastHandler />
      </Suspense>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          নিরাপত্তা ও সেশন
        </h2>
        <p className="text-muted-foreground text-sm">
          আপনার অ্যাকাউন্টের সুরক্ষা নিশ্চিত করুন এবং ডিভাইসগুলো পরিচালনা করুন।
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PasswordChangeSection />
        <TwoFactorSection twoFactorEnabled={user.twoFactorEnabled} />
      </div>

      <ConnectedAccountsSection userAccounts={userAccounts} />

      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">
            আপনার ডিভাইস সমূহ ({activeSessions.length}টি সক্রিয়)
          </h3>
          <form action={revokeAllSessionsAction}>
            <SubmitButton
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              সব থেকে লগআউট
            </SubmitButton>
          </form>
        </div>
        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>ডিভাইস ও ওএস</TableHead>
                <TableHead>আইপি ঠিকানা</TableHead>
                <TableHead>সেশন তৈরি</TableHead>
                <TableHead className="text-right">স্ট্যাটাস</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8"
                  >
                    কোনো সক্রিয় সেশন নেই।
                  </TableCell>
                </TableRow>
              ) : (
                activeSessions.map((session) => {
                  const DeviceIcon = getDeviceIcon(session.userAgent);
                  return (
                    <TableRow key={session.id}>
                      <TableCell className="font-bold flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                          <DeviceIcon
                            size={20}
                            className={
                              session.isCurrent
                                ? "text-primary"
                                : "text-muted-foreground"
                            }
                          />
                        </div>
                        <span>{parseUserAgent(session.userAgent)}</span>
                      </TableCell>
                      <TableCell>
                        <MaskedIpAddress ip={session.ipAddress} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {bnDateTimeFormatter.format(
                          new Date(session.createdAt),
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {session.isCurrent ? (
                          <Badge variant="secondary">বর্তমান</Badge>
                        ) : (
                          <form
                            action={revokeSessionAction.bind(null, session.id)}
                          >
                            <SubmitButton
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs cursor-pointer"
                            >
                              বাতিল করুন
                            </SubmitButton>
                          </form>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
