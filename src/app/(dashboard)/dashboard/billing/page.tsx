import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
              <Icon icon="solar:crown-star-bold" width="16" height="16" /> বর্তমান
              প্ল্যান
            </h3>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-bold text-foreground">প্রো</span>
              <span className="text-sm text-muted-foreground pb-1">/ মাস</span>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              ২ টিবি স্টোরেজ এবং ফ্যামিলি শেয়ারিং অন্তর্ভুক্ত।
            </p>
          </div>
          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-primary text-primary hover:bg-primary hover:text-primary-foreground py-6 text-sm font-semibold cursor-pointer"
                >
                  প্ল্যান ম্যানেজ করুন
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>সাবস্ক্রিপশন প্ল্যান পরিবর্তন</DialogTitle>
                <DialogDescription>
                  আপনার প্রয়োজন অনুযায়ী প্রহর অথের উপযুক্ত প্ল্যান নির্বাচন করুন।
                </DialogDescription>
              </DialogHeader>
              <RadioGroup defaultValue="pro" className="grid gap-3 py-2">
                <label
                  htmlFor="plan-free"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-accent/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="free" id="plan-free" />
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        ফ্রি প্ল্যান
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ১৫ জিবি স্টোরেজ
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-sm">৳০ / মাস</span>
                </label>
                <label
                  htmlFor="plan-pro"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-primary bg-primary/5 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="pro" id="plan-pro" />
                    <div>
                      <p className="font-bold text-primary text-sm">
                        প্রো (Pro)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ২ টিবি স্টোরেজ + ফ্যামিলি
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-primary">
                    ৳২৯৯ / মাস
                  </span>
                </label>
                <label
                  htmlFor="plan-business"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-accent/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="business" id="plan-business" />
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        বিজনেস (Business)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        আনলিমিটেড + কাস্টম ডোমেইন
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-sm">৳৯৯৯ / মাস</span>
                </label>
              </RadioGroup>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  বাতিল
                </DialogClose>
                <Button>প্ল্যান আপডেট করুন</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
