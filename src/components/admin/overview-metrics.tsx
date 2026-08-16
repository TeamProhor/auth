import Link from "next/link";
import {
  ArrowRight,
  Box,
  Card as CardIcon,
  CrownStar,
  Devices,
  ShieldLock,
  Users,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLANS } from "@/lib/constants/billing";
import { formatTimeAgo } from "@/lib/utils";

interface OverviewMetricsProps {
  stats: {
    totalUsers: number;
    newUsers30d: number;
    bannedUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
    paidInvoicesCount: number;
    totalOAuthApps: number;
    activeSessions: number;
    totalAuditLogs: number;
    planDistribution: { planId: string; count: number }[];
    recentActivity: Array<{
      id: string;
      eventType: string;
      ipAddress: string | null;
      details: string | null;
      createdAt: Date;
      user: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
      } | null;
    }>;
  };
}

export function OverviewMetrics({ stats }: OverviewMetricsProps) {
  const metricCards = [
    {
      title: "মোট ব্যবহারকারী",
      value: stats.totalUsers.toLocaleString("bn-BD"),
      sub: `গত ৩০ দিনে +${stats.newUsers30d.toLocaleString("bn-BD")} নতুন`,
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "সক্রিয় সাবস্ক্রিপশন",
      value: stats.activeSubscriptions.toLocaleString("bn-BD"),
      sub: `মোট রাজস্ব: ৳${stats.totalRevenue.toLocaleString("bn-BD")}`,
      icon: CardIcon,
      href: "/admin/subscriptions",
    },
    {
      title: "OAuth ও Dev অ্যাপস",
      value: stats.totalOAuthApps.toLocaleString("bn-BD"),
      sub: "প্ল্যাটফর্ম সংযুক্ত অ্যাপ্লিকেশন",
      icon: Box,
      href: "/admin/oauth-apps",
    },
    {
      title: "লাইভ সেশন",
      value: stats.activeSessions.toLocaleString("bn-BD"),
      sub: `${stats.bannedUsers} জন ইউজার নিষিদ্ধ`,
      icon: Devices,
      href: "/admin/users?filter=banned",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.title} href={c.href} className="group">
              <Card className="hover:border-primary/50 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold text-muted-foreground">
                    {c.title}
                  </CardTitle>
                  <div className="size-8 rounded-lg bg-accent/60 flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
                    <Icon size={16} />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {c.value}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{c.sub}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Grid: Plan Distribution & Recent Security Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscriptions breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <CrownStar size={16} className="text-primary" />
              প্ল্যান বণ্টন
            </CardTitle>
            <CardDescription className="text-xs">
              ব্যবহারকারীদের সাবস্ক্রিপশন প্ল্যানের স্ট্যাটাস
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Object.values(PLANS).map((plan) => {
              const countMatch = stats.planDistribution.find(
                (p) => p.planId === plan.id,
              );
              const countVal = countMatch?.count ?? 0;

              return (
                <div
                  key={plan.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-accent/30 border border-border/50"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-foreground">
                      {plan.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {plan.price === 0 ? "ফ্রি টিয়ার" : `৳${plan.price}/মাস`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-bold">
                      {countVal.toLocaleString("bn-BD")} জন
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Security Audit Feed */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShieldLock size={16} className="text-primary" />
                সাম্প্রতিক সিকিউরিটি অডিট
              </CardTitle>
              <CardDescription className="text-xs">
                সর্বশেষ সিস্টেম ও ব্যবহারকারী সিকিউরিটি ইভেন্টসমূহ
              </CardDescription>
            </div>
            <Link href="/admin/audit-logs">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                সব দেখুন
                <ArrowRight size={12} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                কোনো লগ পাওয়া যায়নি।
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border/60">
                {stats.recentActivity.map((log) => (
                  <div
                    key={log.id}
                    className="py-2.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-2 rounded-full bg-primary shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground truncate">
                            {log.user?.name ||
                              log.user?.email ||
                              "সিস্টেম / অতিথি"}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1 py-0 h-4 uppercase"
                          >
                            {log.eventType.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        {log.details && (
                          <span className="text-[11px] text-muted-foreground truncate">
                            {log.details}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 text-right">
                      <span className="text-[10px] text-muted-foreground">
                        {formatTimeAgo(log.createdAt)}
                      </span>
                      {log.ipAddress && (
                        <span className="text-[9px] font-mono text-muted-foreground/70">
                          {log.ipAddress}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
