"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { enableDeveloperAccessAction } from "@/actions/developer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { User } from "@/db/schema";
import { showToast } from "@/lib/toast";

interface DeveloperApplyCardProps {
  user: User;
}

export function DeveloperApplyCard({ user }: DeveloperApplyCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const firstName = user.name.split(" ")[0];

  const handleEnableDeveloper = () => {
    startTransition(async () => {
      await showToast.promise(enableDeveloperAccessAction(), {
        loading: "ডেভেলপার অ্যাক্সেস চালু করা হচ্ছে...",
        success: (res) => {
          if (!res.success) {
            throw new Error(res.error || "একটি সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
          }
          router.push("/developer");
          router.refresh();
          return "ডেভেলপার পোর্টালে স্বাগতম!";
        },
        error: (err) =>
          err instanceof Error
            ? err.message
            : "একটি সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।",
      });
    });
  };

  const features = [
    {
      icon: "solar:key-bold-duotone",
      title: "OAuth 2.0 & OIDC ম্যানেজমেন্ট",
      description:
        "নিজের ক্লায়েন্ট আইডি, সিক্রেট জেনারেট করুন এবং রিডাইরেক্ট ইউআরআই সেটআপ করুন।",
      badge: "OAuth 2.0",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: "solar:users-group-two-rounded-bold-duotone",
      title: "ইউজার ডিরেক্টরি ও কনসেন্ট",
      description: "আপনার তৈরি অ্যাপে অথরাইজড ইউজারদের তালিকা এবং তাদের পারমিশন দেখুন।",
      badge: "Identity",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: "solar:code-file-bold-duotone",
      title: "ওয়েবহুক ও রিয়েল-টাইম হুকস",
      description:
        "অথেন্টিকেশন ইভেন্ট, সেসন রিভোকেশন এবং সিকিউরিটি অ্যালার্টে ওয়েবহুক রিসিভ করুন।",
      badge: "Webhooks",
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: "solar:chart-square-bold-duotone",
      title: "API অ্যানালিটিক্স ও মেট্রিক্স",
      description:
        "দৈনিক API রিকুয়েস্ট, একটিভ টোকেন এবং ট্রাফিক স্ট্যাটিস্টিক্স মনিটর করুন।",
      badge: "Analytics",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
    {
      icon: "solar:rocket-bold-duotone",
      title: "SDKs & কুইকস্টার্ট গাইড",
      description:
        "Next.js, React, Node.js এবং Python-এর জন্য তৈরি রেডিমেড কোড স্নিপেট।",
      badge: "Quickstart",
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent p-8 md:p-12 text-center shadow-xl">
        <div className="mx-auto size-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30 shadow-inner mb-6">
          <Icon icon="solar:code-square-bold" width="36" height="36" />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight max-w-2xl mx-auto leading-tight">
          {firstName}, প্রহর ডেভেলপার পোর্টালে স্বাগতম 🚀
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          আপনার অ্যাপ্লিকেশনে প্রহর SSO, OAuth 2.0 এবং সেন্ট্রাল আইডেন্টিটি ইন্টিগ্রেট করতে
          ডেভেলপার অ্যাক্সেস চালু করুন।
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={handleEnableDeveloper}
            disabled={isPending}
            className="w-full sm:w-auto px-8 py-6 rounded-2xl text-base font-bold shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            {isPending ? (
              <>
                <Icon
                  icon="solar:spinner-single-bold"
                  className="animate-spin mr-2"
                  width="20"
                  height="20"
                />
                ডেভেলপার অ্যাক্সেস চালু হচ্ছে...
              </>
            ) : (
              <>
                <Icon
                  icon="solar:verified-check-bold"
                  width="20"
                  height="20"
                  className="mr-2"
                />
                ডেভেলপার অ্যাক্সেস চালু করুন (বিনামূল্যে)
              </>
            )}
          </Button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          অ্যাক্সেস নেওয়ার সাথে সাথে আপনি অবিলম্বে ডেভেলপার পোর্টালের সুবিধাগুলো ব্যবহার করতে
          পারবেন।
        </p>
      </div>

      {/* Features Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon
            icon="solar:stars-bold"
            className="text-primary"
            width="22"
            height="22"
          />
          ডেভেলপার পোর্টালের সুবিধাসমূহ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((item) => (
            <Card
              key={item.title}
              className="p-6 rounded-2xl border border-border/80 hover:border-primary/50 transition-colors transition-shadow hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`size-12 rounded-xl flex items-center justify-center border ${item.color}`}
                  >
                    <Icon icon={item.icon} width="24" height="24" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-accent text-muted-foreground border border-border">
                    {item.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
