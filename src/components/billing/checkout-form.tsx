"use client";

import Image from "next/image";
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

  // Card states
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches?.[0] || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const getCardType = (num: string) => {
    if (num.startsWith("4")) return "visa";
    if (num.startsWith("5")) return "mastercard";
    if (num.startsWith("3")) return "amex";
    return "generic";
  };

  const handleSubmit = async () => {
    let methodDisplay = "bKash";
    if (method === "bkash") {
      methodDisplay = `bKash (${phone || "017XXXXXXXX"})`;
    } else if (method === "nagad") {
      methodDisplay = `Nagad (${phone || "018XXXXXXXX"})`;
    } else if (method === "card") {
      const lastFour = cardNumber.slice(-4) || "4242";
      const cardType = getCardType(cardNumber).toUpperCase();
      methodDisplay = `${cardType} •••• ${lastFour}`;
    }

    await subscribeToPlanAction(plan.id, methodDisplay);
  };

  return (
    <Card className="p-6 md:p-8 space-y-8 border-border bg-card">
      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-foreground">
          পেমেন্ট মাধ্যম নির্বাচন
        </h3>
        <p className="text-xs text-muted-foreground">
          অ্যাকাউন্ট (
          <span className="text-foreground font-medium">{user.email}</span>) এর
          জন্য আপনার পছন্দসই পেমেন্ট পদ্ধতি নির্বাচন করুন।
        </p>
      </div>

      <form action={handleSubmit} className="space-y-8">
        <RadioGroup
          value={method}
          onValueChange={setMethod}
          className="grid gap-4"
        >
          {/* bKash */}
          <label
            htmlFor="pay-bkash"
            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 select-none ${
              method === "bkash"
                ? "border-pink-500 bg-pink-500/[0.03] dark:bg-pink-500/[0.02] shadow-xs"
                : "border-border hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center gap-4">
              <RadioGroupItem
                value="bkash"
                id="pay-bkash"
                className="text-pink-500 focus:ring-pink-500"
              />
              <div className="size-12 rounded-xl bg-pink-50 dark:bg-pink-950/20 flex items-center justify-center overflow-hidden border border-pink-100 dark:border-pink-950/30 p-2 shrink-0">
                <Image
                  src="/bkash.webp"
                  alt="bKash"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">
                  বিকাশ (bKash)
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  মোবাইল ব্যাংকিং
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-pink-500 bg-pink-500/10 px-2.5 py-1 rounded-full">
              ইনস্ট্যান্ট
            </span>
          </label>

          {/* Nagad */}
          <label
            htmlFor="pay-nagad"
            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 select-none ${
              method === "nagad"
                ? "border-orange-500 bg-orange-500/[0.03] dark:bg-orange-500/[0.02] shadow-xs"
                : "border-border hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center gap-4">
              <RadioGroupItem
                value="nagad"
                id="pay-nagad"
                className="text-orange-500 focus:ring-orange-500"
              />
              <div className="size-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center overflow-hidden border border-orange-100 dark:border-orange-950/30 p-2 shrink-0">
                <Image
                  src="/nagad.webp"
                  alt="Nagad"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">নগদ (Nagad)</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  মোবাইল ব্যাংকিং
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full">
              ইনস্ট্যান্ট
            </span>
          </label>

          {/* Card */}
          <label
            htmlFor="pay-card"
            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 select-none ${
              method === "card"
                ? "border-primary bg-primary/[0.03] dark:bg-primary/[0.02] shadow-xs"
                : "border-border hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center gap-4">
              <RadioGroupItem
                value="card"
                id="pay-card"
                className="text-primary focus:ring-primary"
              />
              <div className="size-12 rounded-xl bg-white dark:bg-neutral-900 flex items-center justify-center overflow-hidden border border-border p-2 shrink-0">
                <Image
                  src="/mastercard.webp"
                  alt="Card"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">
                  ডেবিট / ক্রেডিট কার্ড
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Visa, Mastercard, AMEX
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                Card
              </span>
            </div>
          </label>
        </RadioGroup>

        {/* Input Details */}
        {method !== "card" ? (
          <div className="space-y-2.5 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Label
              htmlFor="mfs-phone"
              className="text-xs font-semibold text-foreground"
            >
              মোবাইল নম্বর ({method === "bkash" ? "বিকাশ" : "নগদ"})
            </Label>
            <Input
              id="mfs-phone"
              type="tel"
              placeholder="017XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl py-5 text-sm"
              required
            />
          </div>
        ) : (
          <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-3 duration-300">
            {/* Interactive Card Preview */}
            <div className="relative w-full aspect-[1.586/1] h-auto max-w-[400px] mx-auto rounded-2xl bg-linear-to-br from-neutral-800 via-neutral-900 to-neutral-950 text-white p-4 sm:p-6 shadow-xl overflow-hidden border border-neutral-700/50 flex flex-col justify-between transition-all duration-300">
              {/* Card Glow Effect */}
              <div className="absolute -right-10 -top-10 size-32 sm:size-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex justify-between items-start">
                {/* Card Chip */}
                <svg
                  viewBox="0 0 48 48"
                  className="w-12 sm:w-14 h-8 sm:h-10 mt-2 sm:mt-3 ml-1 sm:ml-2 shrink-0 select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Card Chip</title>
                  <path
                    fill="#FF9800"
                    d="M5,35V13c0-2.2,1.8-4,4-4h30c2.2,0,4,1.8,4,4v22c0,2.2-1.8,4-4,4H9C6.8,39,5,37.2,5,35z"
                  />
                  <g fill="#FFD54F">
                    <path d="M43,21v-2H31c-1.1,0-2-0.9-2-2s0.9-2,2-2h1v-2h-1c-2.2,0-4,1.8-4,4s1.8,4,4,4h3v6h-3c-2.8,0-5,2.2-5,5 s2.2,5,5,5h2v-2h-2c-1.7,0-3-1.3-3-3s1.3-3,3-3h12v-2h-7v-6H43z" />
                    <path d="M17,27h-3v-6h3c2.2,0,4-1.8,4-4s-1.8-4-4-4h-3v2h3c1.1,0,2,0.9,2,2s-0.9,2-2,2H5v2h7v6H5v2h12 c1.7,0,3,1.3,3,3s-1.3,3-3,3h-2v2h2c2.8,0,5-2.2,5-5S19.8,27,17,27z" />
                  </g>
                </svg>
              </div>

              {/* Card Number Container */}
              <div className="relative py-1.5 sm:py-2 px-3 bg-white/[0.01] dark:bg-black/[0.1] border border-white/[0.02] rounded-md sm:rounded-lg my-1 backdrop-blur-xs flex items-center justify-center">
                <div className="text-xs sm:text-sm md:text-base font-mono tracking-[0.18em] sm:tracking-[0.25em] text-white font-medium drop-shadow-md text-center">
                  {cardNumber || "•••• •••• •••• 4242"}
                </div>
              </div>

              {/* Footer row */}
              <div className="flex justify-between items-end">
                <div className="flex flex-col min-w-0 max-w-[70%]">
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-neutral-400 font-semibold">
                    কার্ডধারী
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold tracking-wide truncate uppercase">
                    {cardHolder || user.name}
                  </span>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-neutral-400 font-semibold">
                      মেয়াদ
                    </span>
                    <span className="text-[10px] sm:text-xs font-semibold font-mono">
                      {cardExpiry || "MM/YY"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-neutral-400 font-semibold">
                      সিভিসি
                    </span>
                    <span className="text-[10px] sm:text-xs font-semibold font-mono">
                      {cardCvv || "•••"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="card-holder" className="text-xs font-semibold">
                  কার্ডধারীর নাম
                </Label>
                <Input
                  id="card-holder"
                  type="text"
                  placeholder={user.name}
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  className="rounded-xl py-5 text-sm"
                  required
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="card-num" className="text-xs font-semibold">
                  কার্ড নম্বর
                </Label>
                <Input
                  id="card-num"
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  maxLength={19}
                  className="rounded-xl py-5 text-sm font-mono"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-exp" className="text-xs font-semibold">
                  মেয়াদোত্তীর্ণের তারিখ
                </Label>
                <Input
                  id="card-exp"
                  type="text"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  className="rounded-xl py-5 text-sm font-mono"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-cvv" className="text-xs font-semibold">
                  সিভিভি (CVV)
                </Label>
                <Input
                  id="card-cvv"
                  type="password"
                  placeholder="•••"
                  value={cardCvv}
                  onChange={(e) =>
                    setCardCvv(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  maxLength={3}
                  className="rounded-xl py-5 text-sm font-mono"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="space-y-3 pt-6 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>প্ল্যান মূল্য</span>
            <span className="font-semibold text-foreground">
              {plan.priceFormatted}
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>ভ্যাট (VAT)</span>
            <span className="font-semibold text-foreground">৳০</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-foreground pt-3 border-t border-border/50">
            <span>মোট প্রদেয়</span>
            <span className="text-primary text-lg font-black">
              {plan.priceFormatted}
            </span>
          </div>
        </div>

        <SubmitButton
          className={`w-full rounded-xl py-6 text-sm font-bold shadow-md cursor-pointer transition-colors duration-300 ${
            method === "bkash"
              ? "bg-pink-600 hover:bg-pink-700 text-white border-pink-600 hover:border-pink-700"
              : method === "nagad"
                ? "bg-orange-600 hover:bg-orange-700 text-white border-orange-600 hover:border-orange-700"
                : ""
          }`}
        >
          {plan.price === 0 ? "ফ্রি অ্যাক্টিভেট করুন" : "পেমেন্ট নিশ্চিত করুন"}
        </SubmitButton>
      </form>
    </Card>
  );
}
