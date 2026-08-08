import { Icon } from "@iconify/react/dist/iconify.js";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function ProtectionPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          ফ্রড ও বট প্রোটেকশন
        </h2>
        <p className="text-muted-foreground text-sm">
          স্প্যামার এবং অটোমেটেড বটের হাত থেকে আপনার অ্যাপকে সুরক্ষিত রাখুন।
        </p>
      </div>

      <Card className="p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-6 pb-6 border-b border-border">
          <div className="flex gap-4">
            <div className="size-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
              <Icon
                icon="solar:shield-warning-bold-duotone"
                width="28"
                height="28"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                ডিসপোজেবল ইমেইল ব্লক (Disposable Emails)
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Mailinator বা TempMail-এর মতো পরিচিত স্প্যাম ইমেইল ডোমেইনগুলো দিয়ে
                সাইন আপ করা স্বয়ংক্রিয়ভাবে ব্লক করুন।
              </p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-start justify-between gap-6 pb-6 border-b border-border">
          <div className="flex gap-4">
            <div className="size-12 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Icon
                icon="solar:hourglass-line-bold-duotone"
                width="28"
                height="28"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                স্ট্রিক্ট রেট লিমিটিং (Strict Rate Limiting)
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                অ্যাকাউন্ট টেকওভার (Brute-force) ঠেকাতে একই আইপি (IP) থেকে লগইন লিমিট
                আরও কঠোর করুন। (প্রতি মিনিটে সর্বোচ্চ ৩টি চেষ্টা)।
              </p>
            </div>
          </div>
          <Switch />
        </div>

        <div className="flex items-start justify-between gap-6">
          <div className="flex gap-4">
            <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Icon icon="solar:ghost-bold-duotone" width="28" height="28" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                ইনভিজিবল ক্যাপচা (Invisible CAPTCHA)
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                লগইন স্ক্রিনে প্রহর-এর এআই-পাওয়ার্ড বট ডিটেকশন ইঞ্জিন চালু রাখুন। সন্দেহজনক
                আচরণ দেখলে ক্যাপচা পাজল দেখাবে।
              </p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>
      </Card>
    </div>
  );
}
