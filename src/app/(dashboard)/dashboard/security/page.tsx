import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function SecurityPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          নিরাপত্তা ও সেশন
        </h2>
        <p className="text-muted-foreground text-sm">
          আপনার অ্যাকাউন্টের সুরক্ষা নিশ্চিত করুন এবং ডিভাইসগুলো পরিচালনা করুন।
        </p>
      </div>

      <Card className="border-warning/30 bg-warning/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="size-14 rounded-full bg-warning/20 text-warning flex items-center justify-center shrink-0 border border-warning/30">
            <Icon
              icon="solar:shield-warning-bold-duotone"
              width="32"
              height="32"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              নিরাপত্তা চেকআপ প্রস্তাবিত
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              আপনার অ্যাকাউন্টে ২টি নিরাপত্তা ঝুঁকি পাওয়া গেছে। এখনই সমাধান করুন।
            </p>
          </div>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-6 py-6 text-sm font-semibold shrink-0 cursor-pointer">
          চেকআপ শুরু করুন
        </Button>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <CardTitle className="text-lg font-bold">পাসওয়ার্ড পরিবর্তন</CardTitle>
            <CardDescription className="text-sm mt-1">
              নিয়মিত পাসওয়ার্ড পরিবর্তন অ্যাকাউন্টের নিরাপত্তা বাড়ায়。
            </CardDescription>
          </div>
          <Button
            variant="outline"
            className="w-full rounded-xl py-6 text-sm font-semibold cursor-pointer"
          >
            পাসওয়ার্ড আপডেট করুন
          </Button>
        </Card>
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <CardTitle className="text-lg font-bold">
              টু-ফ্যাক্টর অথেন্টিকেশন (2FA)
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              বর্তমানে নিষ্ক্রিয়। অতিরিক্ত নিরাপত্তা স্তর যোগ করুন。
            </CardDescription>
          </div>
          <Button className="w-full rounded-xl py-6 text-sm font-semibold cursor-pointer">
            চালু করুন
          </Button>
        </Card>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">আপনার ডিভাইস সমূহ</h3>
          <Button
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            সব থেকে লগআউট
          </Button>
        </div>
        <div className="space-y-3">
          <Card className="flex flex-row items-center justify-between p-4 border-primary/40 bg-primary/5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                <Icon
                  icon="solar:laptop-bold-duotone"
                  width="28"
                  height="28"
                  className="text-primary"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground flex items-center gap-2">
                  Mac OS - Chrome <Badge variant="secondary">বর্তমান</Badge>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ঢাকা, বাংলাদেশ • 192.168.1.1
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
