"use client";

import { motion } from "motion/react";
import { useEffect, useState, useTransition } from "react";
import { changePasswordAction, setPasswordAction } from "@/actions/user";
import { Key } from "@/components/icons";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { MESSAGES, showToast } from "@/lib/toast";

interface PasswordChangeSectionProps {
  hasPassword?: boolean;
}

export function PasswordChangeSection({
  hasPassword = true,
}: PasswordChangeSectionProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = hasPassword
        ? await changePasswordAction(null, formData)
        : await setPasswordAction(null, formData);

      if (res.success) {
        showToast.success(
          res.message ??
            (hasPassword
              ? MESSAGES.SECURITY.PASSWORD_CHANGE_SUCCESS
              : MESSAGES.SECURITY.PASSWORD_SET_SUCCESS),
        );
        setOpen(false);
        form.reset();
      } else {
        showToast.error(
          res.error ??
            (hasPassword
              ? MESSAGES.SECURITY.PASSWORD_CHANGE_ERROR
              : MESSAGES.SECURITY.PASSWORD_SET_ERROR),
        );
      }
    });
  };

  return (
    <Card className="p-0 overflow-hidden border-border bg-card">
      <PasswordAnimationHeader />
      <div className="p-6">
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Key size={24} className="text-primary" />
              {hasPassword ? "পাসওয়ার্ড পরিবর্তন" : "পাসওয়ার্ড সেট করুন"}
            </CardTitle>
          </div>
          <CardDescription className="text-sm mt-2 leading-relaxed">
            {hasPassword
              ? "অ্যাকাউন্টের সর্বোচ্চ নিরাপত্তা নিশ্চিত করতে নিয়মিত পাসওয়ার্ড পরিবর্তন করা অত্যন্ত জরুরি। একটি শক্তিশালী পাসওয়ার্ড ব্যবহার করুন, যা আপনার তথ্য সুরক্ষিত রাখবে।"
              : "আপনার অ্যাকাউন্টে একটি পাসওয়ার্ড যোগ করুন যাতে আপনি পরবর্তীতে ইমেইল ও পাসওয়ার্ড দিয়েও সরাসরি লগইন করতে পারেন।"}
          </CardDescription>
        </div>

        <ResponsiveDialog
          open={open}
          onOpenChange={setOpen}
          className="sm:max-w-xl"
          trigger={
            <Button
              variant="outline"
              className="w-full rounded-xl py-6 text-sm font-semibold cursor-pointer"
            >
              {hasPassword ? "পাসওয়ার্ড পরিবর্তন করুন" : "পাসওয়ার্ড সেট করুন"}
            </Button>
          }
          title={hasPassword ? "পাসওয়ার্ড পরিবর্তন করুন" : "পাসওয়ার্ড সেট করুন"}
          description={
            hasPassword
              ? "আপনার বর্তমান পাসওয়ার্ড এবং নতুন পাসওয়ার্ড দিন।"
              : "আপনার অ্যাকাউন্টের জন্য একটি শক্তিশালী নতুন পাসওয়ার্ড তৈরি করুন।"
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <FieldGroup>
              {hasPassword && (
                <Field>
                  <FieldLabel htmlFor="currentPassword">
                    বর্তমান পাসওয়ার্ড
                  </FieldLabel>
                  <PasswordInput
                    id="currentPassword"
                    name="currentPassword"
                    required
                  />
                </Field>
              )}
              <Field>
                <FieldLabel htmlFor="newPassword">নতুন পাসওয়ার্ড</FieldLabel>
                <PasswordInput id="newPassword" name="newPassword" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  পাসওয়ার্ড নিশ্চিত করুন
                </FieldLabel>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                />
              </Field>
            </FieldGroup>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                বাতিল
              </Button>
              <SubmitButton isPending={isPending} className="rounded-lg px-4">
                {hasPassword ? "আপডেট করুন" : "পাসওয়ার্ড সেট করুন"}
              </SubmitButton>
            </div>
          </form>
        </ResponsiveDialog>
      </div>
    </Card>
  );
}

const CURR_KEYS = [
  "curr-0",
  "curr-1",
  "curr-2",
  "curr-3",
  "curr-4",
  "curr-5",
  "curr-6",
  "curr-7",
];
const NEW_KEYS = [
  "new-0",
  "new-1",
  "new-2",
  "new-3",
  "new-4",
  "new-5",
  "new-6",
  "new-7",
];

function PasswordAnimationHeader() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev >= 16) {
          setFadeOut(true);
          const _timeout = setTimeout(() => {
            setActiveIndex(0);
            setFadeOut(false);
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const circleLength = 2 * Math.PI * 7;

  return (
    <div className="relative flex flex-col items-center justify-center h-44 w-full rounded-t-xl bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      <div className="w-full max-w-[320px] flex flex-col gap-3 px-4">
        {/* Field 1: Current Password */}
        <div className="w-full rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 p-3 flex items-center justify-between gap-4 bg-background shadow-xs">
          <div className="font-mono text-sm text-foreground select-none leading-none tracking-wider">
            {CURR_KEYS.map((key, idx) => (
              <motion.span
                key={key}
                animate={{ opacity: fadeOut ? 0 : idx < activeIndex ? 1 : 0 }}
                transition={{ duration: 0.1 }}
              >
                •
              </motion.span>
            ))}
          </div>
          <AnimatedCircle
            active={activeIndex >= 8 && !fadeOut}
            circleLength={circleLength}
          />
        </div>

        {/* Field 2: New Password */}
        <div className="w-full rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 p-3 flex items-center justify-between gap-4 bg-background shadow-xs">
          <div className="font-mono text-sm text-foreground select-none leading-none tracking-wider">
            {NEW_KEYS.map((key, idx) => (
              <motion.span
                key={key}
                animate={{
                  opacity: fadeOut ? 0 : idx + 8 < activeIndex ? 1 : 0,
                }}
                transition={{ duration: 0.1 }}
              >
                •
              </motion.span>
            ))}
          </div>
          <AnimatedCircle
            active={activeIndex >= 16 && !fadeOut}
            circleLength={circleLength}
          />
        </div>
      </div>
    </div>
  );
}

function AnimatedCircle({
  active,
  circleLength,
}: {
  active: boolean;
  circleLength: number;
}) {
  return (
    <div className="relative size-5">
      <svg width="20" height="20" className="-rotate-90" aria-hidden="true">
        <title>Status Indicator</title>
        <motion.circle
          cx="10"
          cy="10"
          r="7"
          stroke="#22c55e"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={circleLength}
          strokeDashoffset={circleLength}
          animate={{ strokeDashoffset: active ? 0 : circleLength }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        <motion.circle
          cx="10"
          cy="10"
          r="7"
          fill="#22c55e"
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center text-white"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <svg
          className="size-2.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
          aria-hidden="true"
        >
          <title>Checkmark</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>
    </div>
  );
}
