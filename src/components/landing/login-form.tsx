"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="bg-background border border-border rounded-2xl p-3 shadow-sm">
        <Icon
          icon="solar:shield-bold-duotone"
          width="40"
          height="40"
          className="text-foreground"
        />
      </div>

      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-balance font-semibold text-2xl text-foreground tracking-tight">
          প্রহর অ্যাকাউন্টে স্বাগতম
        </h1>
        <p className="text-pretty text-muted-foreground text-sm">
          নতুন ব্যবহারকারী?{" "}
          <button
            type="button"
            className="text-foreground hover:underline cursor-pointer"
          >
            অ্যাকাউন্ট তৈরি করুন
          </button>
        </p>
      </div>

      <div className="w-full flex flex-col gap-4">
        <Input
          id="login-email"
          className="w-full rounded-xl px-4 py-6 text-sm bg-background border-border"
          placeholder="আপনার ইমেইল ঠিকানা"
          type="email"
          defaultValue="user@example.com"
        />

        <div className="flex flex-col gap-2">
          <Button
            render={<Link href="/magic-link" />}
            nativeButton={false}
            className="w-full rounded-xl px-4 py-6 text-sm font-semibold cursor-pointer active:scale-[0.98]"
          >
            ম্যাজিক লিংক পাঠান
          </Button>
          <Button
            render={<Link href="/dashboard" />}
            nativeButton={false}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground py-6 text-sm cursor-pointer font-medium"
          >
            পাসওয়ার্ড দিয়ে লগইন (ডেমো)
          </Button>
        </div>

        <div className="flex items-center gap-4 py-2 opacity-60">
          <div className="h-[1px] flex-1 bg-border"></div>
          <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
            অথবা
          </span>
          <div className="h-[1px] flex-1 bg-border"></div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            render={<Link href="/dashboard" />}
            nativeButton={false}
            variant="outline"
            className="w-full rounded-xl bg-card hover:bg-accent px-4 py-6 text-sm font-medium flex items-center justify-center gap-3 cursor-pointer shadow-sm"
          >
            <Icon icon="mdi:github" width="22" height="22" /> গিটহাব দিয়ে চালিয়ে
            যান
          </Button>
        </div>
      </div>

      <p className="w-11/12 text-pretty text-center text-muted-foreground text-[11px] leading-relaxed">
        এগিয়ে যাওয়ার মাধ্যমে আপনি আমাদের{" "}
        <button
          type="button"
          className="underline hover:text-foreground cursor-pointer"
        >
          শর্তাবলী
        </button>{" "}
        এবং{" "}
        <button
          type="button"
          className="underline hover:text-foreground cursor-pointer"
        >
          গোপনীয়তা নীতিতে
        </button>{" "}
        সম্মত হচ্ছেন।
      </p>
    </div>
  );
}
