import { redirect } from "next/navigation";
import { getUserSubscription } from "@/actions/billing";
import { OverviewHeader } from "@/components/dashboard/overview-header";
import { ProfileCompletion } from "@/components/dashboard/profile-completion";
import { ServicesGrid } from "@/components/dashboard/services-grid";
import { StorageWidget } from "@/components/dashboard/storage-widget";
import { Card as CardIcon, Code, ShieldCheck } from "@/components/icons";
import { QuickList, QuickListItem } from "@/components/shared/quick-list";
import { getCurrentUser } from "@/lib/auth/session";
import { PLANS } from "@/lib/constants/billing";
import {
  getConnectedApps,
  getDashboardStats,
  getRecentActivity,
} from "@/lib/queries";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [stats, connectedApps, sub, _activity] = await Promise.all([
    getDashboardStats(user.id),
    getConnectedApps(user.id),
    getUserSubscription(user.id),
    getRecentActivity(user.id),
  ]);

  const plan =
    sub?.status === "active"
      ? PLANS[sub.planId] || PLANS["prohor-free"]
      : PLANS["prohor-free"];

  // Compute profile completion score
  const fields = [
    user.name,
    user.email,
    user.emailVerified,
    user.avatarUrl,
    user.phone,
    user.dob,
    user.bio,
  ];
  const completed = fields.filter(Boolean).length;
  const completionPct = Math.round((completed / fields.length) * 100);

  return (
    <>
      <OverviewHeader user={user} stats={stats} plan={plan} />
      <ProfileCompletion completionPct={completionPct} user={user} />

      {/* Quick Navigation Shortcuts */}
      <QuickList
        title="দ্রুত শর্টকাট (Quick Actions)"
        description="আপনার অ্যাকাউন্টের মূল ফিচার ও সেটিংসে দ্রুত প্রবেশ করুন।"
        variant="grid"
        columns={3}
      >
        <QuickListItem
          href="/dashboard/security"
          icon={<ShieldCheck size={24} />}
          color="emerald"
          title="নিরাপত্তা ও ২FA"
          description="পাসওয়ার্ড, সক্রিয় সেশন ও টু-ফ্যাক্টর অথেন্টিকেশন পরিচালনা করুন।"
        />
        <QuickListItem
          href="/dashboard/oauth-keys"
          icon={<Code size={24} />}
          color="purple"
          title="ওঅথ ও এপিআই কী"
          badge={
            <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Dev
            </span>
          }
          description="OAuth ক্লায়েন্ট অ্যাপস ও পার্সোনাল API এক্সেস টোকেন তৈরি করুন।"
        />
        <QuickListItem
          href="/dashboard/billing"
          icon={<CardIcon size={24} />}
          color="blue"
          title="প্ল্যান ও সাবস্ক্রিপশন"
          description="আপনার সক্রিয় সাবস্ক্রিপশন প্ল্যান, পেমেন্ট ও ইনভয়েস দেখুন।"
        />
      </QuickList>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-foreground">প্রহর সার্ভিসেস</h3>
          <ServicesGrid connectedApps={connectedApps} />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">সেন্ট্রাল স্টোরেজ</h3>
          <StorageWidget />
        </div>
      </div>
    </>
  );
}
