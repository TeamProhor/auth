"use client";

import { useActionState, useState } from "react";
import { loginAction, requestMagicLinkAction } from "@/actions/auth";
import { RegisterFormSection } from "@/components/landing/register-form-section";
import { SocialLogins } from "@/components/landing/social-logins";
import { TwoFactorLoginCard } from "@/components/landing/two-factor-login-card";
import { ProhorLogo } from "@/components/shared/prohor-logo";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "email" | "password" | "register";

interface LoginFormProps {
  initial2FAUserId?: string;
}

export function LoginForm({ initial2FAUserId }: LoginFormProps) {
  const [mode, setMode] = useState<Mode>("email");
  const [isGitHubPending, setIsGitHubPending] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);

  const [loginState, loginFormAction] = useActionState(loginAction, null);
  const [magicState, magicFormAction] = useActionState(
    requestMagicLinkAction,
    null,
  );

  const target2FAUserId =
    loginState?.success && loginState.requires2FA && loginState.data?.userId
      ? loginState.data.userId
      : initial2FAUserId;

  if (target2FAUserId) {
    return <TwoFactorLoginCard userId={target2FAUserId} />;
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <ProhorLogo className="size-14 rounded-2xl shadow-sm" />

      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-balance font-semibold text-2xl text-foreground tracking-tight">
          {mode === "register" ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "অ্যাকাউন্টে স্বাগতম"}
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
      {mode === "register" && <RegisterFormSection />}

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

      <SocialLogins
        isGooglePending={isGooglePending}
        isGitHubPending={isGitHubPending}
        onGoogleClick={() => {
          setIsGooglePending(true);
          window.location.href = "/api/auth/google";
        }}
        onGitHubClick={() => {
          setIsGitHubPending(true);
          window.location.href = "/api/auth/github";
        }}
      />

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
