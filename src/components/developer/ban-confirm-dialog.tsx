"use client";

import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/db/schema";

interface BanConfirmDialogProps {
  confirmUser: User | null;
  confirmAction: "ban" | "unban" | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function BanConfirmDialog({
  confirmUser,
  confirmAction,
  isPending,
  onClose,
  onConfirm,
}: BanConfirmDialogProps) {
  return (
    <Dialog
      open={!!confirmUser}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {confirmAction === "ban" ? "ব্যবহারকারী ব্যান করুন?" : "ব্যান তুলে নিন?"}
          </DialogTitle>
          <DialogDescription>
            {confirmAction === "ban"
              ? `${confirmUser?.name} আর আপনার অ্যাপে লগইন করতে পারবেন না।`
              : `${confirmUser?.name}-এর অ্যাক্সেস পুনরুদ্ধার করা হবে।`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>বাতিল</DialogClose>
          <SubmitButton
            variant={confirmAction === "ban" ? "destructive" : "default"}
            onClick={onConfirm}
            type="button"
            isPending={isPending}
            pendingText="হচ্ছে..."
          >
            {confirmAction === "ban" ? "ব্যান করুন" : "অনব্যান করুন"}
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
