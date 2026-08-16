"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Bell, Monitor, Moon, Sun } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

function subscribe() {
  return () => {};
}

export function PreferencesSection() {
  const { theme, setTheme } = useTheme();
  const isServer = useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  );

  const currentTheme = isServer ? "system" : theme;

  return (
    <div className="space-y-6 pt-6 border-t border-border">
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-foreground">
          অ্যাপিয়ারেন্স ও প্রেফারেন্স
        </h3>
        <p className="text-muted-foreground text-xs">
          পুরো প্রহর ইকোসিস্টেমের জন্য আপনার থিম, ভাষা এবং ইমেইল প্রেফারেন্স সেট করুন।
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ─── Appearance & Language ─── */}
        <Card className="p-6 space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>থিম (Theme)</FieldLabel>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center gap-2 p-5 h-auto cursor-pointer transition-all ${
                    currentTheme === "system"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Monitor size={22} />
                  <span className="text-xs font-semibold">সিস্টেম</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center gap-2 p-5 h-auto cursor-pointer transition-all ${
                    currentTheme === "light"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sun size={22} />
                  <span className="text-xs font-semibold">লাইট</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center gap-2 p-5 h-auto cursor-pointer transition-all ${
                    currentTheme === "dark"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Moon size={22} />
                  <span className="text-xs font-semibold">ডার্ক</span>
                </Button>
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="pref-language">ভাষা (Language)</FieldLabel>
              <Select defaultValue="bn">
                <SelectTrigger id="pref-language" className="w-full">
                  <SelectValue placeholder="ভাষা নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="bn">বাংলা (Bangla)</SelectItem>
                    <SelectItem value="en">English (US)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </Card>

        {/* ─── Email Notifications ─── */}
        <Card className="p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2">
              <Bell size={18} className="text-primary" />
              <h4 className="font-bold text-sm text-foreground">
                ইমেইল নোটিফিকেশন
              </h4>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors border border-border/50">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    লগইন অ্যালার্ট
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    নতুন ডিভাইস বা অপরিচিত আইপি থেকে লগইন হলে সাথে সাথে মেইল করুন।
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors border border-border/50">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    প্রোডাক্ট ও সিকিউরিটি আপডেট
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    প্রহর প্ল্যাটফর্মের নতুন নিরাপত্তা ও ফিচার সংক্রান্ত নোটিফিকেশন।
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
