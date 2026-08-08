"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useTransition } from "react";
import {
  disable2FAAction,
  enable2FAAction,
  generate2FASetupAction,
} from "@/actions/two-factor";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
      <Card className="p-6 flex flex-col justify-between space-y-4 border-border bg-card">
        <div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Icon
                icon="solar:shield-warning-bold"
                className="size-5 text-primary"
              />
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
          <CardDescription className="text-sm mt-2">
            {twoFactorEnabled
              ? "আপনার অ্যাকাউন্টে Authenticator App (Google/Authy) দিয়ে 2FA সক্রিয় আছে।"
              : "আপনার অ্যাকাউন্টে অতিরিক্ত নিরাপত্তা স্তরের জন্য 2FA সক্রিয় করুন।"}
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
          <Button
            onClick={handleStartSetup}
            disabled={isPending}
            className="w-full rounded-xl py-6 text-sm font-semibold cursor-pointer"
          >
            {isPending ? "প্রসেস হচ্ছে..." : "2FA সক্রিয় করুন"}
          </Button>
        )}
      </Card>

      {/* ─── Setup 2FA Modal ─── */}
      <Dialog open={openSetup} onOpenChange={setOpenSetup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authenticator App দিয়ে 2FA সেটআপ</DialogTitle>
            <DialogDescription>
              Google Authenticator, Authy বা 1Password অ্যাপ দিয়ে নিচের QR কোডটি
              স্ক্যান করুন।
            </DialogDescription>
          </DialogHeader>

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

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose render={<Button variant="outline" type="button" />}>
              বাতিল
            </DialogClose>
            <SubmitButton
              onClick={handleEnable2FA}
              type="button"
              isPending={isPending}
            >
              যাচাই ও সক্রিয় করুন
            </SubmitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Disable 2FA Modal ─── */}
      <Dialog open={openDisable} onOpenChange={setOpenDisable}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>2FA নিষ্ক্রিয় করতে চান?</DialogTitle>
            <DialogDescription>
              নিষ্ক্রিয় করতে আপনার Authenticator App থেকে ৬-ডিজিটের কোডটি লিখুন।
            </DialogDescription>
          </DialogHeader>

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

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose render={<Button variant="outline" type="button" />}>
              বাতিল
            </DialogClose>
            <SubmitButton
              variant="destructive"
              onClick={handleDisable2FA}
              type="button"
              isPending={isPending}
            >
              নিষ্ক্রিয় করুন
            </SubmitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
