"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";

export function RegisterFormSection() {
  const [registerState, registerFormAction] = useActionState(
    registerAction,
    null,
  );

  const getErr = (field: string) => {
    if (!registerState || registerState.success) return undefined;
    return registerState.fieldErrors?.[field]?.[0];
  };

  return (
    <form action={registerFormAction} className="w-full flex flex-col gap-4">
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
      {getErr("name") && (
        <p className="text-xs text-destructive">{getErr("name")}</p>
      )}
      <Input
        id="reg-email"
        name="email"
        type="email"
        className="w-full rounded-xl px-4 py-6 text-sm"
        placeholder="আপনার ইমেইল ঠিকানা"
        required
      />
      {getErr("email") && (
        <p className="text-xs text-destructive">{getErr("email")}</p>
      )}
      <Input
        id="reg-password"
        name="password"
        type="password"
        className="w-full rounded-xl px-4 py-6 text-sm"
        placeholder="পাসওয়ার্ড (অন্তত ৮ অক্ষর)"
        required
      />
      {getErr("password") && (
        <p className="text-xs text-destructive">{getErr("password")}</p>
      )}
      <SubmitButton
        pendingText="তৈরি হচ্ছে..."
        className="w-full rounded-xl px-4 py-6 text-sm font-semibold"
      >
        অ্যাকাউন্ট তৈরি করুন
      </SubmitButton>
    </form>
  );
}
