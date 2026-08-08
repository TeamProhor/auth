import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { User } from "@/db/schema";

interface ProfileCompletionProps {
  completionPct: number;
  user: User;
}

const CIRCUMFERENCE = 2 * Math.PI * 40; // r=40

function getIncompleteFields(user: User): string[] {
  const missing: string[] = [];
  if (!user.avatarUrl) missing.push("প্রোফাইল ছবি");
  if (!user.phone) missing.push("ফোন নম্বর");
  if (!user.dob) missing.push("জন্ম তারিখ");
  if (!user.bio) missing.push("পরিচিতি (Bio)");
  if (!user.emailVerified) missing.push("ইমেইল যাচাই");
  return missing;
}

export function ProfileCompletion({
  completionPct,
  user,
}: ProfileCompletionProps) {
  if (completionPct >= 100) return null;

  const offset = CIRCUMFERENCE - (completionPct / 100) * CIRCUMFERENCE;
  const missing = getIncompleteFields(user);

  return (
    <div className="rounded-[20px] border border-border bg-card p-1 relative overflow-hidden flex flex-col md:flex-row items-center gap-4 shadow-sm">
      <div className="p-5 flex-1 flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
        <div className="relative shrink-0 flex items-center justify-center">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
            <title>প্রোফাইল সম্পন্নতার হার</title>
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="text-chart-3 transition-[stroke-dashoffset] duration-1000 ease-out"
            />
          </svg>
          <span className="absolute text-sm font-bold text-foreground">
            {completionPct}%
          </span>
        </div>
        <div className="flex-1 space-y-1.5">
          <h3 className="text-lg font-bold text-foreground">
            আপনার প্রোফাইল {completionPct}% সম্পূর্ণ
          </h3>
          {missing.length > 0 && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              বাকি: {missing.slice(0, 3).join(", ")}
              {missing.length > 3 ? ` এবং আরও ${missing.length - 3}টি` : ""}
            </p>
          )}
        </div>
        <Button
          render={<Link href="/dashboard/profile" />}
          nativeButton={false}
          className="w-full md:w-auto shrink-0 rounded-xl px-5 py-6 text-sm font-semibold whitespace-nowrap"
        >
          সম্পূর্ণ করুন
        </Button>
      </div>
    </div>
  );
}
