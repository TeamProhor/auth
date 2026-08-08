import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ProfileCompletion() {
  return (
    <div className="rounded-[20px] border border-border bg-card p-1 relative overflow-hidden flex flex-col md:flex-row items-center gap-4 shadow-sm">
      <div className="absolute top-0 left-0 bottom-0 w-1 bg-chart-3"></div>
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
            ></circle>
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset="50.24"
              className="text-chart-3 transition-[stroke-dashoffset] duration-1000 ease-out"
            ></circle>
          </svg>
          <span className="absolute text-sm font-bold text-foreground">
            ৮০%
          </span>
        </div>
        <div className="flex-1 space-y-1.5">
          <h3 className="text-lg font-bold text-foreground">
            আপনার প্রোফাইল ৮০% সম্পূর্ণ
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            অ্যাকাউন্টের সর্বোচ্চ নিরাপত্তা নিশ্চিত করতে একটি রিকভারি ইমেইল যুক্ত করুন এবং
            প্রোফাইল হেলথ ১০০% সম্পন্ন করুন।
          </p>
        </div>
        <Button
          render={<Link href="/dashboard/security" />}
          nativeButton={false}
          className="w-full md:w-auto shrink-0 rounded-xl px-5 py-6 text-sm font-semibold whitespace-nowrap"
        >
          সম্পূর্ণ করুন
        </Button>
      </div>
    </div>
  );
}
