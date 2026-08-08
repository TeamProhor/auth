import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          ডেটা ও গোপনীয়তা
        </h2>
        <p className="text-muted-foreground text-sm">
          আপনার ডেটা পরিচালনা করুন এবং থার্ড-পার্টি অ্যাপ অ্যাক্সেস নিয়ন্ত্রণ করুন।
        </p>
      </div>

      <Card className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 border-b border-border pb-6">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
            <Icon
              icon="solar:cloud-download-bold-duotone"
              width="24"
              height="24"
              className="text-primary"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">
              আপনার ডেটা ডাউনলোড করুন (Takeout)
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              প্রহর প্ল্যাটফর্মে থাকা আপনার সমস্ত তথ্যের (মেইল, ড্রাইভ, ছবি) একটি কপি জিপ
              ফাইল হিসেবে তৈরি করুন।
            </p>
          </div>
          <Button className="rounded-xl px-5 py-6 text-sm font-semibold shrink-0 cursor-pointer">
            আর্কাইভ তৈরি করুন
          </Button>
        </div>

        <div className="pt-2">
          <h3 className="text-lg font-bold text-foreground mb-4">
            থার্ড-পার্টি অ্যাপ অ্যাক্সেস
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
              <div className="flex items-center gap-4">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-accent font-bold text-foreground">
                    V
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Vawzine App
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    অ্যাক্সেস: বেসিক প্রোফাইল, ইমেইল
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                অ্যাক্সেস বাতিল
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4 pt-6 border-t border-destructive/20 mt-10">
        <h3 className="text-xl font-bold text-destructive">বিপজ্জনক জোন</h3>
        <Card className="border-destructive/30 bg-destructive/5 p-6 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
          <div>
            <p className="text-base font-bold text-foreground">
              অ্যাকাউন্ট মুছে ফেলুন
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              আপনার সমস্ত ডেটা (মেইল, ছবি, ড্রাইভ) স্থায়ীভাবে মুছে ফেলা হবে।
            </p>
          </div>
          <Button
            variant="destructive"
            className="rounded-xl px-6 py-6 text-sm font-semibold shrink-0 cursor-pointer"
          >
            ডিলিট অ্যাকাউন্ট
          </Button>
        </Card>
      </div>
    </div>
  );
}
