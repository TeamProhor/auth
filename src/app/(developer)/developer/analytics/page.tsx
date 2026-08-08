import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function AnalyticsPage() {
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
              মাসিক সক্রিয় ব্যবহারকারী
            </h3>
            <Icon
              icon="solar:users-group-rounded-bold"
              width="20"
              height="20"
              className="text-muted-foreground"
            />
          </div>
          <p className="text-3xl font-bold text-foreground">১,২০৪</p>
          <Badge
            variant="secondary"
            className="mt-2 text-emerald-500 bg-emerald-500/10"
          >
            <Icon
              icon="solar:trend-up-bold"
              width="14"
              height="14"
              className="mr-1"
            />{" "}
            গত মাস থেকে +১২%
          </Badge>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              সফল লগইন
            </h3>
            <Icon
              icon="solar:check-circle-bold"
              width="20"
              height="20"
              className="text-emerald-500"
            />
          </div>
          <p className="text-3xl font-bold text-foreground">৮,৪৩২</p>
          <p className="text-xs text-muted-foreground mt-2">গত ৩০ দিনে</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              ব্যর্থ প্রচেষ্টা
            </h3>
            <Icon
              icon="solar:danger-triangle-bold"
              width="20"
              height="20"
              className="text-destructive"
            />
          </div>
          <p className="text-3xl font-bold text-foreground">২৩</p>
          <p className="text-xs text-muted-foreground mt-2">গত ৩০ দিনে</p>
        </Card>
      </div>

      <Card className="p-6 md:p-8">
        <h3 className="text-lg font-bold text-foreground mb-6">
          এপিআই রিকোয়েস্ট (গত ৭ দিন)
        </h3>
        <div className="h-[200px] flex items-end justify-between gap-2 border-b border-border pb-2">
          <div
            className="w-full bg-primary/20 rounded-t-md relative group cursor-pointer hover:bg-primary/40 transition-colors"
            style={{ height: "40%" }}
          ></div>
          <div
            className="w-full bg-primary/40 rounded-t-md relative group cursor-pointer hover:bg-primary/60 transition-colors"
            style={{ height: "60%" }}
          ></div>
          <div
            className="w-full bg-primary/30 rounded-t-md relative group cursor-pointer hover:bg-primary/50 transition-colors"
            style={{ height: "50%" }}
          ></div>
          <div
            className="w-full bg-primary/80 rounded-t-md relative group cursor-pointer hover:bg-primary transition-colors"
            style={{ height: "90%" }}
          ></div>
          <div
            className="w-full bg-primary/50 rounded-t-md relative group cursor-pointer hover:bg-primary/70 transition-colors"
            style={{ height: "70%" }}
          ></div>
          <div
            className="w-full bg-primary/60 rounded-t-md relative group cursor-pointer hover:bg-primary/80 transition-colors"
            style={{ height: "75%" }}
          ></div>
          <div
            className="w-full bg-primary rounded-t-md relative group cursor-pointer hover:bg-primary/90 transition-colors"
            style={{ height: "100%" }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
          <span>সোম</span>
          <span>মঙ্গল</span>
          <span>বুধ</span>
          <span>বৃহঃ</span>
          <span>শুক্রবার</span>
          <span>শনি</span>
          <span>রবি</span>
        </div>
      </Card>
    </div>
  );
}
