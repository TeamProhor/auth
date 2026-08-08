"use client";

import { Icon } from "@iconify/react";
import { useActionState, useState, useTransition } from "react";
import {
  loginAction,
  registerAction,
  requestMagicLinkAction,
} from "@/actions/auth";
import { verify2FALoginAction } from "@/actions/two-factor";
import { ProhorLogo } from "@/components/shared/prohor-logo";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type ActionResult =
  | {
      success: true;
      message?: string;
      requires2FA?: boolean;
      data?: { userId: string };
    }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

function fieldErr(
  state: ActionResult | null,
  field: string,
): string | undefined {
  if (!state || state.success) return undefined;
  return state.fieldErrors?.[field]?.[0];
}

type Mode = "email" | "password" | "register";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("email");
  const [otpCode, setOtpCode] = useState("");
  const [totpError, setTotpError] = useState("");
  const [isPending2FA, startTransition2FA] = useTransition();

  const [loginState, loginFormAction] = useActionState(loginAction, null);
  const [registerState, registerFormAction] = useActionState(
    registerAction,
    null,
  );
  const [magicState, magicFormAction] = useActionState(
    requestMagicLinkAction,
    null,
  );

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginState?.success || !loginState.data?.userId) return;
    const userId = loginState.data.userId;
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

  if (magicState?.success) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="size-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
          <Icon icon="solar:letter-bold" width="32" height="32" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">
            ইমেইল পাঠানো হয়েছে!
          </h1>
          <p className="text-sm text-muted-foreground">{magicState.message}</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => window.location.reload()}
          className="text-sm cursor-pointer"
        >
          আবার চেষ্টা করুন
        </Button>
      </div>
    );
  }

  // ─── 2FA Interception Verification Card ───
  if (
    loginState?.success &&
    loginState.requires2FA &&
    loginState.data?.userId
  ) {
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-primary">
          <Icon icon="solar:shield-keyhole-bold" width="36" height="36" />
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

  return (
    <div className="flex flex-col items-center gap-8">
      <ProhorLogo className="size-14 rounded-2xl shadow-sm" />

      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-balance font-semibold text-2xl text-foreground tracking-tight">
          {mode === "register" ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "প্রহর অ্যাকাউন্টে স্বাগতম"}
        </h1>
        <p className="text-pretty text-muted-foreground text-sm">
          {mode === "register" ? (
            <>
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <button
                type="button"
                onClick={() => setMode("email")}
                className="text-foreground hover:underline cursor-pointer"
              >
                লগইন করুন
              </button>
            </>
          ) : (
            <>
              নতুন ব্যবহারকারী?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-foreground hover:underline cursor-pointer"
              >
                অ্যাকাউন্ট তৈরি করুন
              </button>
            </>
          )}
        </p>
      </div>

      {/* ─── Register Mode ─── */}
      {mode === "register" && (
        <form
          action={registerFormAction}
          className="w-full flex flex-col gap-4"
        >
          {registerState && !registerState.success && (
            <p className="text-sm text-destructive text-center rounded-xl bg-destructive/10 px-4 py-3">
              {registerState.error}
            </p>
          )}
          <Input
            id="reg-name"
            name="name"
            className="w-full rounded-xl px-4 py-6 text-sm"
            placeholder="আপনার পুরো নাম"
            required
          />
          {fieldErr(registerState, "name") && (
            <p className="text-xs text-destructive">
              {fieldErr(registerState, "name")}
            </p>
          )}
          <Input
            id="reg-email"
            name="email"
            type="email"
            className="w-full rounded-xl px-4 py-6 text-sm"
            placeholder="আপনার ইমেইল ঠিকানা"
            required
          />
          {fieldErr(registerState, "email") && (
            <p className="text-xs text-destructive">
              {fieldErr(registerState, "email")}
            </p>
          )}
          <Input
            id="reg-password"
            name="password"
            type="password"
            className="w-full rounded-xl px-4 py-6 text-sm"
            placeholder="পাসওয়ার্ড (অন্তত ৮ অক্ষর)"
            required
          />
          {fieldErr(registerState, "password") && (
            <p className="text-xs text-destructive">
              {fieldErr(registerState, "password")}
            </p>
          )}
          <SubmitButton
            pendingText="তৈরি হচ্ছে..."
            className="w-full rounded-xl px-4 py-6 text-sm font-semibold"
          >
            অ্যাকাউন্ট তৈরি করুন
          </SubmitButton>
        </form>
      )}

      {/* ─── Email / Magic Link Mode ─── */}
      {mode === "email" && (
        <form action={magicFormAction} className="w-full flex flex-col gap-4">
          {magicState && !magicState.success && (
            <p className="text-sm text-destructive text-center rounded-xl bg-destructive/10 px-4 py-3">
              {magicState.error}
            </p>
          )}
          <Input
            id="login-email"
            name="email"
            className="w-full rounded-xl px-4 py-6 text-sm bg-background border-border"
            placeholder="আপনার ইমেইল ঠিকানা"
            type="email"
            required
          />
          <SubmitButton
            pendingText="পাঠানো হচ্ছে..."
            className="w-full rounded-xl px-4 py-6 text-sm font-semibold cursor-pointer active:scale-[0.98]"
          >
            ম্যাজিক লিংক পাঠান
          </SubmitButton>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setMode("password")}
            className="w-full text-muted-foreground hover:text-foreground py-6 text-sm cursor-pointer font-medium"
          >
            পাসওয়ার্ড দিয়ে লগইন
          </Button>
        </form>
      )}

      {/* ─── Password Mode ─── */}
      {mode === "password" && (
        <form action={loginFormAction} className="w-full flex flex-col gap-4">
          {loginState && !loginState.success && (
            <p className="text-sm text-destructive text-center rounded-xl bg-destructive/10 px-4 py-3">
              {loginState.error}
            </p>
          )}
          <Input
            id="pw-email"
            name="email"
            type="email"
            className="w-full rounded-xl px-4 py-6 text-sm"
            placeholder="ইমেইল ঠিকানা"
            required
          />
          <Input
            id="pw-password"
            name="password"
            type="password"
            className="w-full rounded-xl px-4 py-6 text-sm"
            placeholder="পাসওয়ার্ড"
            required
          />
          <SubmitButton
            pendingText="যাচাই করা হচ্ছে..."
            className="w-full rounded-xl px-4 py-6 text-sm font-semibold"
          >
            লগইন করুন
          </SubmitButton>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setMode("email")}
            className="w-full text-muted-foreground py-4 text-sm cursor-pointer"
          >
            ← ম্যাজিক লিংকে ফিরুন
          </Button>
        </form>
      )}

      {/* ─── Divider ─── */}
      <div className="w-full flex items-center gap-4 py-2 opacity-60">
        <div className="h-[1px] flex-1 bg-border" />
        <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
          অথবা
        </span>
        <div className="h-[1px] flex-1 bg-border" />
      </div>

      <div className="w-full flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            window.location.href = "/api/auth/github";
          }}
          className="w-full rounded-xl bg-card hover:bg-accent hover:text-foreground px-4 py-6 text-sm font-medium flex items-center justify-center gap-3 cursor-pointer shadow-sm"
        >
          <Icon icon="mdi:github" width="22" height="22" />
          গিটহাব দিয়ে চালিয়ে যান
        </Button>
      </div>

      <p className="w-11/12 text-pretty text-center text-muted-foreground text-[11px] leading-relaxed">
        এগিয়ে যাওয়ার মাধ্যমে আপনি আমাদের{" "}
        <button
          type="button"
          className="underline hover:text-foreground cursor-pointer"
        >
          শর্তাবলী
        </button>{" "}
        এবং{" "}
        <button
          type="button"
          className="underline hover:text-foreground cursor-pointer"
        >
          গোপনীয়তা নীতিতে
        </button>{" "}
        সম্মত হচ্ছেন।
      </p>
    </div>
  );
}
