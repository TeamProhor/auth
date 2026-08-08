"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ConsentCard() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="bg-background border border-border rounded-2xl p-3 shadow-sm">
          <Icon
            icon="solar:shield-bold-duotone"
            width="32"
            height="32"
            className="text-foreground"
          />
        </div>
        <Icon
          icon="solar:arrow-right-line-duotone"
          width="24"
          height="24"
          className="text-muted-foreground"
        />
        <div className="bg-primary text-primary-foreground border border-border rounded-2xl w-14 h-14 flex items-center justify-center shadow-sm font-bold text-xl">
          V
        </div>
      </div>

      <div className="text-center flex flex-col gap-2">
        <h1 className="text-xl font-bold text-foreground">
          Vawzine App অ্যাক্সেস চাইছে
        </h1>
        <p className="text-sm text-muted-foreground">
          অ্যাপ্লিকেশনটি নিচের তথ্যগুলো অ্যাক্সেস করতে পারবে:
        </p>
      </div>

      <div className="w-full rounded-2xl border border-border bg-background overflow-hidden">
        <div className="flex items-start gap-4 p-4 border-b border-border">
          <Icon
            icon="solar:user-id-bold-duotone"
            width="24"
            height="24"
            className="text-foreground mt-0.5"
          />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-foreground">
              প্রাথমিক প্রোফাইল
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              আপনার নাম ও প্রোফাইল ছবি
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 border-b border-border">
          <Icon
            icon="solar:letter-bold-duotone"
            width="24"
            height="24"
            className="text-foreground mt-0.5"
          />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-foreground">ইমেইল ঠিকানা</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              অ্যাকাউন্টের ইমেইল
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-muted/50">
          <Icon
            icon="solar:danger-circle-bold-duotone"
            width="24"
            height="24"
            className="text-destructive mt-0.5"
          />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-foreground">
              পাসওয়ার্ড অ্যাক্সেস
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              পাসওয়ার্ড অ্যাক্সেস করতে{" "}
              <span className="font-bold text-destructive">পারবে না</span>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full pt-2 flex flex-col-reverse sm:flex-row gap-3">
        <Button
          render={<Link href="/login" />}
          nativeButton={false}
          variant="outline"
          className="flex-1 rounded-xl bg-card hover:bg-accent px-4 py-6 text-sm font-semibold cursor-pointer"
        >
          বাতিল করুন
        </Button>
        <Button
          render={<Link href="/dashboard" />}
          nativeButton={false}
          className="flex-1 rounded-xl px-4 py-6 text-sm font-semibold cursor-pointer"
        >
          অনুমোদন করুন
        </Button>
      </div>
    </div>
  );
}
