"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { changePasswordAction } from "@/actions/user";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MESSAGES, showToast } from "@/lib/toast";

export function PasswordChangeSection() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(changePasswordAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      showToast.success(
        state.message ?? MESSAGES.SECURITY.PASSWORD_CHANGE_SUCCESS,
      );
      setOpen(false);
    } else {
      showToast.error(state.error ?? MESSAGES.SECURITY.PASSWORD_CHANGE_ERROR);
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await showToast.promise(
        new Promise((resolve) => {
          formAction(formData);
          resolve(true);
        }),
        {
          loading: MESSAGES.SECURITY.PASSWORD_CHANGE_LOADING,
          success: MESSAGES.SECURITY.PASSWORD_CHANGE_SUCCESS,
          error: MESSAGES.SECURITY.PASSWORD_CHANGE_ERROR,
        },
      );
    });
  };

  return (
    <Card className="p-6 flex flex-col justify-between space-y-4">
      <div>
        <CardTitle className="text-lg font-bold">পাসওয়ার্ড পরিবর্তন</CardTitle>
        <CardDescription className="text-sm mt-1">
          নিয়মিত পাসওয়ার্ড পরিবর্তন অ্যাকাউন্টের নিরাপত্তা বাড়ায়।
        </CardDescription>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="w-full rounded-xl py-6 text-sm font-semibold cursor-pointer"
            />
          }
        >
          পাসওয়ার্ড আপডেট করুন
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>পাসওয়ার্ড পরিবর্তন করুন</DialogTitle>
            <DialogDescription>
              আপনার বর্তমান পাসওয়ার্ড এবং নতুন পাসওয়ার্ড দিন।
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="currentPassword">বর্তমান পাসওয়ার্ড</FieldLabel>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="newPassword">নতুন পাসওয়ার্ড</FieldLabel>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  পাসওয়ার্ড নিশ্চিত করুন
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </Field>
            </FieldGroup>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                বাতিল
              </Button>
              <SubmitButton isPending={isPending} className="rounded-lg px-4">
                আপডেট করুন
              </SubmitButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
