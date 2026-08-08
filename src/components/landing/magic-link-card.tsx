"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MagicLinkCard() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="size-16 rounded-full bg-accent flex items-center justify-center border border-border shadow-inner">
        <Icon
          icon="solar:letter-bold"
          width="32"
          height="32"
          className="text-foreground"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-foreground">ইমেইল চেক করুন</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          আমরা{" "}
          <span className="font-medium text-foreground">user@example.com</span>{" "}
          ঠিকানায় একটি ম্যাজিক লিংক পাঠিয়েছি।
        </p>
      </div>

      <div className="w-full pt-4 flex flex-col gap-3">
        <Button
          render={<Link href="/dashboard" />}
          nativeButton={false}
          variant="outline"
          className="w-full rounded-xl bg-card hover:bg-accent px-4 py-6 text-sm font-medium cursor-pointer text-primary"
        >
          ম্যাজিক লিংকে ক্লিক করুন (সিমুলেশন)
        </Button>
        <Button
          render={<Link href="/login" />}
          nativeButton={false}
          variant="ghost"
          className="w-full text-muted-foreground hover:text-foreground text-sm py-6 cursor-pointer"
        >
          অন্য ইমেইল ব্যবহার করুন
        </Button>
      </div>

      <div className="pt-8 border-t border-border/50 w-full">
        <Button
          render={<Link href="/oauth/consent" />}
          nativeButton={false}
          variant="secondary"
          className="w-full rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
        >
          OAuth কনসেন্ট ডেমো দেখুন
        </Button>
      </div>
    </div>
  );
}
