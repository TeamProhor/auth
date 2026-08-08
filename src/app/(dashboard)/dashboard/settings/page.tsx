import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          সেটিংস ও নোটিফিকেশন
        </h2>
        <p className="text-muted-foreground text-sm">
          পুরো প্রহর ইকোসিস্টেমের জন্য আপনার থিম, ভাষা এবং ইমেইল প্রেফারেন্স সেট করুন।
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">অ্যাপিয়ারেন্স ও ভাষা</h3>
          <Card className="p-6 space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel>থিম (Theme)</FieldLabel>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 p-6 h-auto border-ring bg-accent text-foreground cursor-pointer"
                  >
                    <Icon
                      icon="solar:monitor-bold-duotone"
                      width="24"
                      height="24"
                    />
                    <span className="text-xs font-semibold">সিস্টেম</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 p-6 h-auto cursor-pointer"
                  >
                    <Icon
                      icon="solar:sun-bold-duotone"
                      width="24"
                      height="24"
                    />
                    <span className="text-xs font-semibold">লাইট</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 p-6 h-auto cursor-pointer"
                  >
                    <Icon
                      icon="solar:moon-bold-duotone"
                      width="24"
                      height="24"
                    />
                    <span className="text-xs font-semibold">ডার্ক</span>
                  </Button>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="language">ভাষা (Language)</FieldLabel>
                <select
                  id="language"
                  aria-label="ভাষা (Language)"
                  className="w-full rounded-md bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>বাংলা (Bangla)</option>
                  <option>English (US)</option>
                </select>
              </Field>
            </FieldGroup>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">
            ইমেইল নোটিফিকেশন
          </h3>
          <Card className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-accent transition-colors">
              <div>
                <p className="text-sm font-bold text-foreground">লগইন অ্যালার্ট</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  নতুন ডিভাইস থেকে লগইন হলে মেইল করুন।
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-accent transition-colors">
              <div>
                <p className="text-sm font-bold text-foreground">
                  প্রোডাক্ট আপডেট
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  প্রহর ইকোসিস্টেমের নতুন ফিচার সম্পর্কে জানুন।
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
