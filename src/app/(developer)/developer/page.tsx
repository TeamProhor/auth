import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DeveloperPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Icon
              icon="solar:code-square-bold-duotone"
              width="16"
              height="16"
            />
            ডেভেলপার পোর্টাল
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            প্রহর এপিআই ও অ্যাপ্লিকেশন ম্যানেজমেন্ট
          </h1>
          <p className="text-sm text-muted-foreground">
            আপনার অ্যাপ্লিকেশন ইন্টিগ্রেট করুন, এপিআই কি (API Keys) জেনারেট করুন এবং
            পারমিশন ও ওয়েবহুক কনফিগার করুন।
          </p>
        </div>
        <div className="flex items-center gap-3 z-10 shrink-0">
          <Button
            render={<Link href="/developer/apps" />}
            nativeButton={false}
            className="rounded-xl px-5 py-6 text-sm font-semibold"
          >
            <Icon
              icon="solar:add-circle-bold-duotone"
              width="18"
              height="18"
              className="mr-2"
            />
            নতুন অ্যাপ তৈরি করুন
          </Button>
          <Button
            render={<Link href="/developer/docs" />}
            nativeButton={false}
            variant="outline"
            className="rounded-xl px-5 py-6 text-sm font-semibold"
          >
            এপিআই ডকস
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">সক্রিয় অ্যাপস</span>
            <Icon
              icon="solar:box-minimalistic-bold-duotone"
              width="20"
              height="20"
              className="text-primary"
            />
          </div>
          <p className="text-2xl font-bold text-foreground">৩টি</p>
          <p className="text-xs text-emerald-500 font-medium">
            ● সব সিস্টেম সচল
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">মোট এপিআই কল (এই মাসে)</span>
            <Icon
              icon="solar:chart-square-bold-duotone"
              width="20"
              height="20"
              className="text-chart-1"
            />
          </div>
          <p className="text-2xl font-bold text-foreground">১২৪,৫৮০</p>
          <p className="text-xs text-muted-foreground">লিমিট: ৫০,০০০,০০০</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">রেজিস্টার্ড ইউজার</span>
            <Icon
              icon="solar:users-group-rounded-bold-duotone"
              width="20"
              height="20"
              className="text-chart-2"
            />
          </div>
          <p className="text-2xl font-bold text-foreground">১,২৪৫</p>
          <p className="text-xs text-emerald-500 font-medium">+১২% এই সপ্তাহে</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">গড় রেসপন্স টাইম</span>
            <Icon
              icon="solar:stopwatch-bold-duotone"
              width="20"
              height="20"
              className="text-chart-3"
            />
          </div>
          <p className="text-2xl font-bold text-foreground">৪৫ms</p>
          <p className="text-xs text-emerald-500 font-medium">৯৯.৯৯% আপটাইম</p>
        </div>
      </div>

      {/* Developer Modules Navigation Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">ডেভেলপার ফিচারসমূহ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "অ্যাপস ও ওয়েবহুক",
              desc: "ক্লায়েন্ট আইডি, সিক্রেট ম্যানেজমেন্ট এবং ওয়েবহুক অ্যান্ডপয়েন্ট টেস্ট করুন।",
              url: "/developer/apps",
              icon: "solar:box-minimalistic-bold-duotone",
            },
            {
              title: "ইউজার ডিরেক্টরি",
              desc: "আপনার কানেক্টেড অ্যাপ্লিকেশনগুলোর ইউজারদের ডেটা ও সেশন তদারকি করুন।",
              url: "/developer/users",
              icon: "solar:users-group-rounded-bold-duotone",
            },
            {
              title: "রোল ও পারমিশন (RBAC)",
              desc: "কাস্টম স্কোপ, রোল এবং পারমিশন রুলস সেটআপ করুন।",
              url: "/developer/rbac",
              icon: "solar:shield-keyhole-bold-duotone",
            },
            {
              title: "লগইন অ্যাকশনস (Hooks)",
              desc: "সার্ভারলেস ইভেন্ট হুক এবং লগইনফ্লো কাস্টমাইজেশন।",
              url: "/developer/hooks",
              icon: "solar:code-file-bold-duotone",
            },
            {
              title: "বট প্রোটেকশন & সিকিউরিটি",
              desc: "রেট লিমিটিং, ক্যাপচা এবং আইপি রেস্ট্রিকশন কনফিগার করুন।",
              url: "/developer/protection",
              icon: "solar:shield-warning-bold-duotone",
            },
            {
              title: "কুইকস্টার্ট ও SDK",
              desc: "Next.js, Node.js, Python ও React SDK গাইড ও টেমপ্লেট।",
              url: "/developer/quickstart",
              icon: "solar:rocket-bold-duotone",
            },
          ].map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className="bg-card hover:bg-accent/50 border border-border rounded-xl p-5 transition-colors group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon icon={item.icon} width="22" height="22" />
                </div>
                <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="flex items-center text-xs font-medium text-primary gap-1 pt-2">
                দেখুন{" "}
                <Icon
                  icon="solar:alt-arrow-right-linear"
                  width="14"
                  height="14"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
