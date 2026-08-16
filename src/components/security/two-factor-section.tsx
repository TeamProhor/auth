"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import {
  disable2FAAction,
  enable2FAAction,
  generate2FASetupAction,
} from "@/actions/two-factor";
import { ShieldAlert } from "@/components/icons";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

interface TwoFactorSectionProps {
  twoFactorEnabled: boolean;
}

export function TwoFactorSection({ twoFactorEnabled }: TwoFactorSectionProps) {
  const [openSetup, setOpenSetup] = useState(false);
  const [openDisable, setOpenDisable] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [setupData, setSetupData] = useState<{
    secret: string;
    qrCodeDataUrl: string;
  } | null>(null);

  const [otpCode, setOtpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleStartSetup = () => {
    setErrorMsg("");
    setOtpCode("");
    startTransition(async () => {
      const res = await generate2FASetupAction();
      if (res.success) {
        setSetupData({
          secret: res.secret,
          qrCodeDataUrl: res.qrCodeDataUrl,
        });
        setOpenSetup(true);
      }
    });
  };

  const handleEnable2FA = () => {
    if (!setupData || otpCode.length !== 6) {
      setErrorMsg("অনুগ্রহ করে ৬-ডিজিটের সম্পূর্ণ কোডটি লিখুন।");
      return;
    }
    setErrorMsg("");
    startTransition(async () => {
      const res = await enable2FAAction(setupData.secret, otpCode);
      if (res.success) {
        setOpenSetup(false);
        setSetupData(null);
      } else {
        setErrorMsg(res.error || "যাচাইকরণ ব্যর্থ হয়েছে।");
      }
    });
  };

  const handleDisable2FA = () => {
    if (otpCode.length !== 6) {
      setErrorMsg("অনুগ্রহ করে ৬-ডিজিটের সম্পূর্ণ কোডটি লিখুন।");
      return;
    }
    setErrorMsg("");
    startTransition(async () => {
      const res = await disable2FAAction(otpCode);
      if (res.success) {
        setOpenDisable(false);
        setOtpCode("");
      } else {
        setErrorMsg(res.error || "নিষ্ক্রিয়করণ ব্যর্থ হয়েছে।");
      }
    });
  };

  return (
    <>
      <Card className="p-0 overflow-hidden border-border bg-card">
        <OTPAnimationHeader />
        <div className="p-6">
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldAlert size={24} className="text-primary" />
                টু-ফ্যাক্টর অথেন্টিকেশন (2FA)
              </CardTitle>
              {twoFactorEnabled ? (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-500"
                >
                  সক্রিয়
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  নিষ্ক্রিয়
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm mt-2 leading-relaxed">
              {twoFactorEnabled
                ? "আপনার অ্যাকাউন্টে Authenticator অ্যাপের মাধ্যমে 2FA সফলভাবে সক্রিয় আছে। লগইন করার সময় এখন থেকে পাসওয়ার্ডের পাশাপাশি ওটিপি (OTP) প্রয়োজন হবে।"
                : "আপনার অ্যাকাউন্টের অতিরিক্ত নিরাপত্তা নিশ্চিত করতে টু-ফ্যাক্টর অথেন্টিকেশন (2FA) চালু করুন। এটি সক্রিয় থাকলে অন্য কেউ আপনার অ্যাকাউন্টে লগইন করতে পারবে না।"}
            </CardDescription>
          </div>

          {twoFactorEnabled ? (
            <Button
              variant="outline"
              onClick={() => {
                setErrorMsg("");
                setOtpCode("");
                setOpenDisable(true);
              }}
              className="w-full rounded-xl py-6 text-sm font-semibold text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              2FA নিষ্ক্রিয় করুন
            </Button>
          ) : (
            <SubmitButton
              onClick={handleStartSetup}
              isPending={isPending}
              className="w-full rounded-xl py-6 text-sm font-semibold cursor-pointer"
            >
              2FA সক্রিয় করুন
            </SubmitButton>
          )}
        </div>
      </Card>

      {/* ─── Setup 2FA Modal ─── */}
      <ResponsiveDialog
        open={openSetup}
        onOpenChange={setOpenSetup}
        className="sm:max-w-xl"
        title="Authenticator App দিয়ে 2FA সেটআপ"
        description="Google Authenticator, Authy বা 1Password অ্যাপ দিয়ে নিচের QR কোডটি স্ক্যান করুন।"
      >
        {setupData && (
          <div className="flex flex-col items-center space-y-4 py-2">
            <div className="bg-white p-3 rounded-2xl border border-border shadow-md">
              <Image
                src={setupData.qrCodeDataUrl}
                alt="2FA QR Code"
                width={176}
                height={176}
                unoptimized
                className="size-44 object-contain"
              />
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">
                অথবা ম্যানুয়ালি কোড লিখুন:
              </p>
              <code className="text-xs font-mono font-bold bg-muted px-2.5 py-1 rounded-md tracking-wider text-foreground select-all">
                {setupData.secret}
              </code>
            </div>

            <div className="w-full space-y-2 pt-2 text-center">
              <p className="text-xs font-semibold text-foreground">
                অ্যাপ থেকে প্রাপ্ত ৬-ডিজিটের কোডটি লিখুন:
              </p>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={(val) => setOtpCode(val)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-destructive text-center font-medium bg-destructive/10 px-3 py-1.5 rounded-lg w-full">
                {errorMsg}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpenSetup(false)}
          >
            বাতিল
          </Button>
          <SubmitButton
            onClick={handleEnable2FA}
            type="button"
            isPending={isPending}
          >
            যাচাই ও সক্রিয় করুন
          </SubmitButton>
        </div>
      </ResponsiveDialog>

      {/* ─── Disable 2FA Modal ─── */}
      <ResponsiveDialog
        open={openDisable}
        onOpenChange={setOpenDisable}
        className="sm:max-w-xl"
        title="2FA নিষ্ক্রিয় করতে চান?"
        description="নিষ্ক্রিয় করতে আপনার Authenticator App থেকে ৬-ডিজিটের কোডটি লিখুন।"
      >
        <div className="flex flex-col items-center space-y-3 py-3">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={(val) => setOtpCode(val)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {errorMsg && (
            <p className="text-xs text-destructive text-center font-medium bg-destructive/10 px-3 py-1.5 rounded-lg w-full">
              {errorMsg}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpenDisable(false)}
          >
            বাতিল
          </Button>
          <SubmitButton
            variant="destructive"
            onClick={handleDisable2FA}
            type="button"
            isPending={isPending}
          >
            নিষ্ক্রিয় করুন
          </SubmitButton>
        </div>
      </ResponsiveDialog>
    </>
  );
}

const digits = ["4", "8", "3", "1", "9", "7"];
const DIGIT_IDS = [
  "digit-0",
  "digit-1",
  "digit-2",
  "digit-3",
  "digit-4",
  "digit-5",
];

function OTPAnimationHeader() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (activeIndex > digits.length) {
      const timeout = setTimeout(() => {
        setActiveIndex(0);
        setFadeOut(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      setActiveIndex((prev) => prev + 1);
    }, 400);

    if (activeIndex === digits.length - 1) {
      const timeout = setTimeout(() => {
        setFadeOut(true);
      }, 450);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <div className="relative flex items-center justify-center h-44 w-full rounded-t-xl bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      <div className="flex w-full items-center justify-center gap-2 sm:gap-3">
        {DIGIT_IDS.map((id, idx) => (
          <div
            key={id}
            className={cn(
              "text-foreground font-bold relative flex h-10 w-8 items-center justify-center rounded-md border border-neutral-200 bg-linear-to-br from-neutral-50 to-white dark:border-none dark:from-neutral-800 dark:to-neutral-800",
              "shadow-[0_1px_2px_rgb(0,0,0,0.1)]",
            )}
          >
            <motion.div
              className="absolute inset-0 rounded-md border border-cyan-400"
              initial={{ opacity: 0, scale: 1, filter: "blur(0px)" }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.85, 1.3],
                filter: "blur(2px)",
              }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 2.25 }}
              style={{ boxShadow: "inset 0 0 12px rgba(34, 211, 238, 0.5)" }}
            />
            {activeIndex === idx && (
              <motion.div
                key={`glow-${id}`}
                layoutId="glow"
                className="absolute inset-0 rounded-md border border-cyan-400"
                initial={
                  idx === 0 ? { opacity: 0, scale: 1.7 } : { scale: 1.7 }
                }
                animate={idx === 0 ? { opacity: 1, scale: 1 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ boxShadow: "inset 0 0 12px rgba(34, 211, 238, 0.6)" }}
              >
                <svg
                  viewBox="0 0 20 20"
                  className="absolute inset-0 h-full w-full"
                  strokeWidth="0.4"
                  aria-hidden="true"
                >
                  <title>Glow Indicator</title>
                  <path
                    d="M 3 19 h 14"
                    className="stroke-cyan-400 dark:stroke-cyan-500"
                  />
                </svg>
              </motion.div>
            )}
            <motion.span
              animate={{ opacity: fadeOut ? 0 : idx < activeIndex ? 1 : 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              {digits[idx]}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}
