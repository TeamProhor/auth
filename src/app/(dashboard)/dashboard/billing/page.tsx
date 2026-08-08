import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          পেমেন্ট ও ফ্যামিলি
        </h2>
        <p className="text-muted-foreground text-sm">
          সাবস্ক্রিপশন পরিচালনা করুন এবং পরিবারের সদস্যদের সাথে প্রহর প্রো শেয়ার করুন।
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/30 bg-primary/5 p-6 flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div>
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              <Icon
                icon="solar:crown-star-bold-duotone"
                width="16"
                height="16"
              />{" "}
              বর্তমান প্ল্যান
            </h3>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-bold text-foreground">প্রো</span>
              <span className="text-sm text-muted-foreground pb-1">/ মাস</span>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              ২ টিবি স্টোরেজ এবং ফ্যামিলি শেয়ারিং অন্তর্ভুক্ত।
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full rounded-xl border-primary text-primary hover:bg-primary hover:text-primary-foreground py-6 text-sm font-semibold cursor-pointer"
          >
            প্ল্যান ম্যানেজ করুন
          </Button>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">পেমেন্ট মাধ্যম</h3>
            <Button
              variant="link"
              className="text-primary text-sm font-semibold p-0 h-auto cursor-pointer"
            >
              + যোগ করুন
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-background">
            <div className="flex items-center gap-3">
              <div className="bg-card border border-border p-1.5 rounded-md">
                <Icon icon="logos:mastercard" width="24" height="24" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  •••• ৪২৪২
                </p>
                <p className="text-xs text-muted-foreground">মেয়াদ: ১২/২৮</p>
              </div>
            </div>
            <Badge variant="secondary">প্রাথমিক</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
