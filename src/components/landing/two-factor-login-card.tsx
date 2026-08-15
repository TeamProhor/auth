"use client";

import { useState, useTransition } from "react";
import { verify2FALoginAction } from "@/actions/two-factor";
import { ShieldLock } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface TwoFactorLoginCardProps {
  userId: string;
}

export function TwoFactorLoginCard({ userId }: TwoFactorLoginCardProps) {
  const [otpCode, setOtpCode] = useState("");
  const [totpError, setTotpError] = useState("");
  const [isPending2FA, startTransition2FA] = useTransition();

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setTotpError("৬-ডিজিটের সম্পূর্ণ কোডটি লিখুন।");
      return;
    }
    setTotpError("");
    startTransition2FA(async () => {
      const res = await verify2FALoginAction(userId, otpCode);
      if (res && !res.success) {
        setTotpError(res.error);
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-primary">
        <ShieldLock size={36} />
      </div>

      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-semibold text-2xl text-foreground tracking-tight">
          ২FA যাচাইকরণ
        </h1>
        <p className="text-muted-foreground text-xs">
          আপনার Authenticator App থেকে ৬-ডিজিটের নিরাপত্তা কোডটি লিখুন।
        </p>
      </div>

      <form
        onSubmit={handle2FASubmit}
        className="w-full flex flex-col gap-6 items-center"
      >
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

        {totpError && (
          <p className="text-xs text-destructive text-center font-medium bg-destructive/10 px-3 py-2 rounded-lg w-full">
            {totpError}
          </p>
        )}

        <SubmitButton
          isPending={isPending2FA}
          className="w-full rounded-xl py-6 text-sm font-semibold cursor-pointer"
        >
          যাচাই ও লগইন করুন
        </SubmitButton>

        <Button
          type="button"
          variant="ghost"
          onClick={() => window.location.reload()}
          className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          ← পুনরায় লগইন পাতায় ফিরুন
        </Button>
      </form>
    </div>
  );
}
