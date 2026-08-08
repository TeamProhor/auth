"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { subscribeToPlanAction } from "@/actions/billing";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Plan } from "@/lib/constants/billing";

interface CheckoutFormProps {
  plan: Plan;
  user: {
    name: string;
    email: string;
  };
}

export function CheckoutForm({ plan, user }: CheckoutFormProps) {
  const [method, setMethod] = useState("bkash");
  const [phone, setPhone] = useState("");

  const handleSubmit = async () => {
    let methodDisplay = "bKash";
    if (method === "bkash") methodDisplay = `bKash (${phone || "017XXXXXXXX"})`;
    else if (method === "nagad")
      methodDisplay = `Nagad (${phone || "018XXXXXXXX"})`;
    else if (method === "rocket")
      methodDisplay = `Rocket (${phone || "019XXXXXXXX"})`;
    else if (method === "card") methodDisplay = "Mastercard ••• 4242";

    await subscribeToPlanAction(plan.id, methodDisplay);
  };

  return (
    <Card className="p-6 md:p-8 space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-foreground">
          পেমেন্ট মাধ্যম নির্বাচন
        </h3>
        <p className="text-xs text-muted-foreground">
          অ্যাকাউন্ট ({user.email}) এর জন্য আপনার পছন্দসই অর্থপ্রদান পদ্ধতি নির্বাচন করুন।
        </p>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <RadioGroup
          value={method}
          onValueChange={setMethod}
          className="grid gap-3"
        >
          {/* bKash */}
          <label
            htmlFor="pay-bkash"
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              method === "bkash"
                ? "border-pink-500 bg-pink-500/5 shadow-xs"
                : "border-border hover:bg-accent/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="bkash" id="pay-bkash" />
              <div className="size-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold text-xs">
                bKash
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">
                  বিকাশ (bKash)
                </p>
                <p className="text-xs text-muted-foreground">মোবাইল ব্যাংকিং</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-pink-500">ইনস্ট্যান্ট</span>
          </label>

          {/* Nagad */}
          <label
            htmlFor="pay-nagad"
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              method === "nagad"
                ? "border-orange-500 bg-orange-500/5 shadow-xs"
                : "border-border hover:bg-accent/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="nagad" id="pay-nagad" />
              <div className="size-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-xs">
                নগদ
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">নগদ (Nagad)</p>
                <p className="text-xs text-muted-foreground">মোবাইল ব্যাংকিং</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-orange-500">
              ইনস্ট্যান্ট
            </span>
          </label>

          {/* Card */}
          <label
            htmlFor="pay-card"
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              method === "card"
                ? "border-primary bg-primary/5 shadow-xs"
                : "border-border hover:bg-accent/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="card" id="pay-card" />
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Icon icon="solar:card-bold" width="18" height="18" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">
                  ডেবিট / ক্রেডিট কার্ড
                </p>
                <p className="text-xs text-muted-foreground">
                  Visa, Mastercard, AMEX
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 opacity-80">
              <Icon icon="logos:mastercard" width="22" height="22" />
              <Icon icon="logos:visa" width="22" height="22" />
            </div>
          </label>
        </RadioGroup>

        {/* Input Details */}
        {method !== "card" ? (
          <div className="space-y-2 pt-2">
            <Label htmlFor="mfs-phone" className="text-xs font-medium">
              মোবাইল নম্বর ({method.toUpperCase()})
            </Label>
            <Input
              id="mfs-phone"
              type="tel"
              placeholder="017XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl py-5"
              required
            />
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <div>
              <Label htmlFor="card-num" className="text-xs font-medium">
                কার্ড নম্বর
              </Label>
              <Input
                id="card-num"
                type="text"
                placeholder="•••• •••• •••• 4242"
                defaultValue="4242 4242 4242 4242"
                className="rounded-xl py-5 font-mono text-sm"
                required
              />
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="space-y-2 pt-4 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>প্ল্যান মূল্য</span>
            <span>{plan.priceFormatted}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>ভ্যাট (VAT)</span>
            <span>৳০</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border/50">
            <span>মোট প্রদেয়</span>
            <span className="text-primary text-base font-extrabold">
              {plan.priceFormatted}
            </span>
          </div>
        </div>

        <SubmitButton className="w-full rounded-xl py-6 text-sm font-bold shadow-md cursor-pointer">
          {plan.price === 0 ? "ফ্রি অ্যাক্টিভেট করুন" : "পেমেন্ট নিশ্চিত করুন"}
        </SubmitButton>
      </form>
    </Card>
  );
}
