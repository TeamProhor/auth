"use client";

import { Icon } from "@iconify/react";
import { useActionState, useState } from "react";
import {
  loginAction,
  registerAction,
  requestMagicLinkAction,
} from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";

type ActionResult =
  | { success: true; message?: string }
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

  const [loginState, loginFormAction, loginPending] = useActionState(
    loginAction,
    null,
  );
  const [registerState, registerFormAction, registerPending] = useActionState(
    registerAction,
    null,
  );
  const [magicState, magicFormAction, magicPending] = useActionState(
    requestMagicLinkAction,
    null,
  );

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
          className="text-sm"
        >
          আবার চেষ্টা করুন
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="bg-background border border-border rounded-2xl p-3 shadow-sm">
        <Icon
          icon="solar:shield-bold"
          width="40"
          height="40"
          className="text-foreground"
        />
      </div>

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
          variant="outline"
          className="w-full rounded-xl bg-card hover:bg-accent px-4 py-6 text-sm font-medium flex items-center justify-center gap-3 cursor-pointer shadow-sm"
          disabled
        >
          <Icon icon="mdi:github" width="22" height="22" />
          গিটহাব দিয়ে চালিয়ে যান
          <span className="ml-auto text-[10px] text-muted-foreground">
            (শীঘ্রই)
          </span>
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
