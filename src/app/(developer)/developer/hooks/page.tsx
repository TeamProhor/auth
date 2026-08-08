import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";

export default function HooksPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          লগইন অ্যাকশনস (Auth Hooks)
        </h2>
        <p className="text-muted-foreground text-sm">
          লগইন সম্পূর্ণ হওয়ার ঠিক আগে কাস্টম জাভাস্ক্রিপ্ট (JavaScript) রান করে লগইন ব্লক করুন
          বা প্রোফাইল মডিফাই করুন।
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col min-h-[450px]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-background rounded-lg border border-border text-xs font-mono font-semibold text-foreground flex items-center gap-2">
              <Icon icon="logos:javascript" width="14" height="14" />{" "}
              onUserLogin.js
            </div>
            <div className="px-3 py-1.5 hover:bg-accent rounded-lg text-xs font-mono font-medium text-muted-foreground cursor-pointer transition-colors flex items-center gap-2">
              <Icon
                icon="logos:javascript"
                width="14"
                height="14"
                className="grayscale opacity-50"
              />{" "}
              onUserSignup.js
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-500 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
              ডিপ্লয় করা হয়েছে
            </span>
            <Button
              size="sm"
              className="rounded-lg font-bold shadow-sm cursor-pointer"
            >
              সেভ ও ডিপ্লয়
            </Button>
          </div>
        </div>
        <div className="flex-1 bg-[#0d0d0d] p-4 font-mono text-sm overflow-auto text-[#d4d4d4] leading-relaxed">
          <pre>{`export default async function onExecutePostLogin(event, api) {
  // ১. ব্যবহারকারীর ইমেইল টেম্পমেইল (TempMail) কি না চেক করুন
  if (event.user.email.endsWith('@tempmail.com')) {
    return api.access.deny('টেম্পোরারি ইমেইল অনুমোদিত নয়।');
  }

  // ২. যদি ব্যবহারকারী নির্দিষ্ট দেশ থেকে আসে, তবে ব্লক করুন
  if (event.request.geoip.countryCode === 'RU') {
    return api.access.deny('আপনার দেশ থেকে লগইন করা সম্ভব নয়।');
  }

  // ৩. কাস্টম মেটাডেটা (Metadata) টোকেনে যুক্ত করুন
  api.idToken.setCustomClaim(
    'https://vawzine.com/loyalty_points', 
    event.user.app_metadata?.points || 0
  );
}`}</pre>
        </div>
      </div>
    </div>
  );
}
