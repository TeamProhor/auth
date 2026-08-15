import Link from "next/link";
import { CloudPlus } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { STORAGE_BREAKDOWN } from "@/lib/constants/ui";

export function StorageWidget() {
  return (
    <Card className="p-6 flex flex-col h-[calc(100%-44px)] min-h-[300px]">
      <div>
        <div className="flex items-end justify-between mb-2">
          <h4 className="text-3xl font-bold text-foreground">
            ৮.৫{" "}
            <span className="text-lg text-muted-foreground font-semibold">
              জিবি
            </span>
          </h4>
          <span className="text-sm font-medium text-muted-foreground">
            ১৫ জিবির মধ্যে ব্যবহৃত
          </span>
        </div>
        <Progress value={56} className="h-3 mt-4" />
      </div>
      <div className="space-y-3 mt-6 flex-1">
        {STORAGE_BREAKDOWN.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div className={`size-3 rounded-sm ${item.color}`} />
              <span className="text-foreground font-medium">{item.title}</span>
            </div>
            <span className="text-muted-foreground">{item.used}</span>
          </div>
        ))}
      </div>
      <Link
        href="/dashboard/billing"
        className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <CloudPlus size={20} /> স্টোরেজ আপগ্রেড করুন
      </Link>
    </Card>
  );
}
