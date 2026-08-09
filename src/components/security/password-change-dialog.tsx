"use client";

import { useActionState, useState } from "react";
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

export function PasswordChangeSection() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(changePasswordAction, null);

  return (
    <Card className="p-6 flex flex-col justify-between space-y-4">
      <div>
        <CardTitle className="text-lg font-bold">পাসওয়ার্ড পরিবর্তন</CardTitle>
        <CardDescription className="text-sm mt-1">
          নিয়মিত পাসওয়ার্ড পরিবর্তন অ্যাকাউন্টের নিরাপত্তা বাড়ায়।
        </CardDescription>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full rounded-xl py-6 text-sm font-semibold cursor-pointer"
          >
            পাসওয়ার্ড আপডেট করুন
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>পাসওয়ার্ড পরিবর্তন করুন</DialogTitle>
            <DialogDescription>
              আপনার বর্তমান পাসওয়ার্ড এবং নতুন পাসওয়ার্ড দিন।
            </DialogDescription>
          </DialogHeader>

          <form action={formAction} className="space-y-4 pt-2">
            {state?.error && (
              <p className="text-sm text-destructive font-medium">{state.error}</p>
            )}
            {state?.message && (
              <p className="text-sm text-emerald-500 font-medium">{state.message}</p>
            )}

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
                <FieldLabel htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</FieldLabel>
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
              <SubmitButton className="rounded-lg px-4">আপডেট করুন</SubmitButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
