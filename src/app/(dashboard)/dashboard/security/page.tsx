import { Icon } from "@iconify/react/dist/iconify.js";
import { redirect } from "next/navigation";
import { revokeAllSessionsAction, revokeSessionAction } from "@/actions/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import { MaskedIpAddress } from "@/components/dashboard/masked-ip";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser, getUserSessions } from "@/lib/auth/session";

function _formatDate(date: Date): string {
  return new Intl.RelativeTimeFormat("bn", { numeric: "auto" }).format(
    Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    "day",
  );
}

function getDeviceIcon(userAgent: string | null): string {
  if (!userAgent) return "solar:laptop-bold";
  const ua = userAgent.toLowerCase();
  if (ua.includes("iphone") || ua.includes("android"))
    return "solar:smartphone-bold";
  if (ua.includes("ipad") || ua.includes("tablet")) return "solar:tablet-bold";
  return "solar:laptop-bold";
}

function formatIp(ip: string | null): string {
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

export default async function SecurityPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const activeSessions = await getUserSessions(user.id);

  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          নিরাপত্তা ও সেশন
        </h2>
        <p className="text-muted-foreground text-sm">
          আপনার অ্যাকাউন্টের সুরক্ষা নিশ্চিত করুন এবং ডিভাইসগুলো পরিচালনা করুন।
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <CardTitle className="text-lg font-bold">পাসওয়ার্ড পরিবর্তন</CardTitle>
            <CardDescription className="text-sm mt-1">
              নিয়মিত পাসওয়ার্ড পরিবর্তন অ্যাকাউন্টের নিরাপত্তা বাড়ায়।
            </CardDescription>
          </div>
          <Button
            variant="outline"
            className="w-full rounded-xl py-6 text-sm font-semibold cursor-pointer"
          >
            পাসওয়ার্ড আপডেট করুন
          </Button>
        </Card>
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <CardTitle className="text-lg font-bold">
              টু-ফ্যাক্টর অথেন্টিকেশন (2FA)
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              বর্তমানে নিষ্ক্রিয়। অতিরিক্ত নিরাপত্তা স্তর যোগ করুন।
            </CardDescription>
          </div>
          <Button
            className="w-full rounded-xl py-6 text-sm font-semibold cursor-pointer"
            disabled
          >
            শীঘ্রই আসছে
          </Button>
        </Card>
      </div>

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
                activeSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-bold flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                        <Icon
                          icon={getDeviceIcon(session.userAgent)}
                          width="20"
                          height="20"
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
                      {new Intl.DateTimeFormat("bn", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(session.createdAt))}
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
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
