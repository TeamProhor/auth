"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserItem } from "./page";

interface UserActionModalsProps {
  selectedUser: UserItem | null;
  activeDialog: "profile" | "access" | "ban" | null;
  setActiveDialog: (dialog: "profile" | "access" | "ban" | null) => void;
  handleBanToggle: () => void;
}

export function UserActionModals({
  selectedUser,
  activeDialog,
  setActiveDialog,
  handleBanToggle,
}: UserActionModalsProps) {
  return (
    <>
      {/* View Profile Dialog */}
      <Dialog
        open={activeDialog === "profile"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ব্যবহারকারীর বিবরণ</DialogTitle>
            <DialogDescription>
              {selectedUser?.name} এর প্রোফাইল ও অ্যাকাউন্ট সম্পর্কিত তথ্য।
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/40 border border-border">
                <Avatar className="size-12">
                  <AvatarFallback
                    className={`${selectedUser.avatarColorClass} font-bold text-base`}
                  >
                    {selectedUser.avatarText}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-foreground text-base">
                    {selectedUser.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-md bg-background border border-border">
                  <span className="text-muted-foreground block">সাইন আপ</span>
                  <span className="font-semibold text-foreground">
                    {selectedUser.joined}
                  </span>
                </div>
                <div className="p-3 rounded-md bg-background border border-border">
                  <span className="text-muted-foreground block">শেষ লগইন</span>
                  <span className="font-semibold text-foreground">
                    {selectedUser.lastLogin}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      {/* Edit Access Dialog */}
      <Dialog
        open={activeDialog === "access"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>অ্যাক্সেস রোল পরিবর্তন</DialogTitle>
            <DialogDescription>
              {selectedUser?.name} এর জন্য সিস্টেম রোল নির্বাচন করুন।
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-2">
            <Field>
              <FieldLabel htmlFor="user-role">সিস্টেম রোল (Role)</FieldLabel>
              <Select defaultValue="developer">
                <SelectTrigger id="user-role" className="w-full">
                  <SelectValue placeholder="রোল সিলেক্ট করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              বাতিল
            </DialogClose>
            <Button onClick={() => setActiveDialog(null)}>সংরক্ষণ করুন</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban / Unban Dialog */}
      <Dialog
        open={activeDialog === "ban"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.status === "active"
                ? "ব্যবহারকারী ব্যান নিশ্চিতকরণ"
                : "ব্যবহারকারী অনব্যান নিশ্চিতকরণ"}
            </DialogTitle>
            <DialogDescription>
              আপনি কি নিশ্চিত যে {selectedUser?.name} কে{" "}
              {selectedUser?.status === "active" ? "ব্যান" : "অনব্যান"} করতে চান?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              বাতিল
            </DialogClose>
            <Button
              variant={
                selectedUser?.status === "active" ? "destructive" : "default"
              }
              onClick={handleBanToggle}
            >
              {selectedUser?.status === "active" ? "ব্যান করুন" : "অনব্যান করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
