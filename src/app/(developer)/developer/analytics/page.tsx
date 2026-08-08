import { Icon } from "@iconify/react/dist/iconify.js";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { getDeveloperDailyUsage, getDeveloperStats } from "@/lib/queries";

const toBn = (n: number) => n.toLocaleString("bn-BD");

const DAY_LABELS = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
}

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [stats, dailyUsage] = await Promise.all([
    getDeveloperStats(user.id),
    getDeveloperDailyUsage(user.id),
  ]);

  // Build chart data for last 7 days
  const last7 = getLast7Days();
  const usageMap = new Map(dailyUsage.map((r) => [r.day, r.count]));
  const chartData = last7.map((date) => {
    const key = date.toISOString().split("T")[0];
    return {
      label: DAY_LABELS[date.getDay()],
      count: usageMap.get(key) ?? 0,
    };
  });
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="max-w-4xl space-y-10">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          অ্যানালিটিক্স ও কোটা
        </h2>
        <p className="text-muted-foreground text-sm">
          আপনার অ্যাপ্লিকেশনের ব্যবহার ও এপিআই লিমিট মনিটর করুন।
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              মোট ব্যবহারকারী
            </h3>
            <Icon
              icon="solar:users-group-rounded-bold"
              width="20"
              height="20"
              className="text-muted-foreground"
            />
          </div>
          <p className="text-3xl font-bold text-foreground">
            {toBn(stats.totalUsers)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">আপনার অ্যাপ অনুমোদিত</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              মোট অ্যাক্সেস টোকেন
            </h3>
            <Icon
              icon="solar:check-circle-bold"
              width="20"
              height="20"
              className="text-emerald-500"
            />
          </div>
          <p className="text-3xl font-bold text-foreground">
            {toBn(stats.totalTokens)}
          </p>
          <Badge
            variant="secondary"
            className={`mt-2 ${stats.activeTokens > 0 ? "text-emerald-500 bg-emerald-500/10" : ""}`}
          >
            সক্রিয়: {toBn(stats.activeTokens)}টি
          </Badge>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              সক্রিয় অ্যাপস
            </h3>
            <Icon
              icon="solar:box-minimalistic-bold"
              width="20"
              height="20"
              className="text-primary"
            />
          </div>
          <p className="text-3xl font-bold text-foreground">
            {toBn(stats.totalApps)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {stats.totalApps === 0 ? "কোনো অ্যাপ নেই" : "OAuth ক্লায়েন্ট"}
          </p>
        </Card>
      </div>

      <Card className="p-6 md:p-8">
        <h3 className="text-lg font-bold text-foreground mb-6">
          এপিআই রিকোয়েস্ট (গত ৭ দিন)
        </h3>
        {chartData.every((d) => d.count === 0) ? (
          <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Icon
              icon="solar:chart-2-bold"
              width="40"
              height="40"
              className="opacity-30"
            />
            <p className="text-sm">এখনো কোনো এপিআই ব্যবহার নেই</p>
          </div>
        ) : (
          <>
            <div className="h-[200px] flex items-end justify-between gap-2 border-b border-border pb-2">
              {chartData.map((day) => {
                const pct = (day.count / maxCount) * 100;
                const opacity = 20 + Math.round((pct / 100) * 80);

                return (
                  <div
                    key={day.label}
                    className="w-full rounded-t-md bg-primary transition-all hover:opacity-100 cursor-pointer group relative"
                    style={{
                      height: `${Math.max(pct, 4)}%`,
                      opacity: opacity / 100,
                    }}
                  >
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 border border-border">
                      {day.label}: {day.count} টি লগ
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
              {chartData.map((day) => (
                <span key={day.label}>{day.label}</span>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
