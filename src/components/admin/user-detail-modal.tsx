"use client";

import { useState, useTransition } from "react";
import { revokeAllUserSessionsByAdminAction } from "@/actions/admin-sessions";
import { overrideSubscriptionAction } from "@/actions/admin-subscriptions";
import {
  toggleAdminStatusAction,
  toggleBanUserAction,
  toggleEmailVerifiedAction,
} from "@/actions/admin-users";
import { CheckCircle, CrownStar, Danger, Devices } from "@/components/icons";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PLANS } from "@/lib/constants/billing";
import { formatDateTime } from "@/lib/utils";

interface UserDetailModalProps {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    avatarUrl: string | null;
    phone: string | null;
    dob: string | null;
    gender: string | null;
    bio: string | null;
    isAdmin: boolean;
    isBanned: boolean;
    twoFactorEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    subscription?: {
      planId: string;
      status: string;
    } | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailModal({
  user,
  open,
  onOpenChange,
}: UserDetailModalProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedPlan, setSelectedPlan] = useState(
    user.subscription?.planId || "prohor-free",
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const initial = (user.name[0] || user.email[0] || "U").toUpperCase();

  const handleBanToggle = () => {
    startTransition(async () => {
      const res = await toggleBanUserAction(user.id, !user.isBanned);
      if (res.success) {
        setStatusMessage(res.message || "সফলভাবে আপডেট হয়েছে।");
      } else {
        setStatusMessage(res.error);
      }
    });
  };

  const handleAdminToggle = () => {
    startTransition(async () => {
      const res = await toggleAdminStatusAction(user.id, !user.isAdmin);
      if (res.success) {
        setStatusMessage(res.message || "অ্যাডমিন স্ট্যাটাস আপডেট হয়েছে।");
      } else {
        setStatusMessage(res.error);
      }
    });
  };

  const handleVerifyEmail = () => {
    startTransition(async () => {
      const res = await toggleEmailVerifiedAction(user.id, !user.emailVerified);
      if (res.success) {
        setStatusMessage(res.message || "ইমেইল স্ট্যাটাস আপডেট হয়েছে।");
      } else {
        setStatusMessage(res.error);
      }
    });
  };

  const handlePlanChange = () => {
    startTransition(async () => {
      const res = await overrideSubscriptionAction(user.id, selectedPlan);
      if (res.success) {
        setStatusMessage(res.message || "প্ল্যান আপডেট হয়েছে।");
      } else {
        setStatusMessage(res.error);
      }
    });
  };

  const handleRevokeSessions = () => {
    startTransition(async () => {
      const res = await revokeAllUserSessionsByAdminAction(user.id);
      if (res.success) {
        setStatusMessage(res.message || "সেশন বাতিল হয়েছে।");
      } else {
        setStatusMessage(res.error);
      }
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex items-center gap-3 text-left">
          <Avatar className="size-11 border border-border">
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user.name} />
            ) : null}
            <AvatarFallback className="text-sm font-bold bg-primary/20 text-primary">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-bold text-foreground truncate">
              {user.name}
            </span>
            <span className="text-xs font-normal text-muted-foreground truncate">
              {user.email}
            </span>
          </div>
        </div>
      }
      description={null}
      className="sm:max-w-xl"
    >
      <div className="flex flex-col gap-6 pt-1 text-left">
        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {user.isAdmin && (
            <Badge
              variant="default"
              className="text-[10px] uppercase font-bold gap-1"
            >
              <CrownStar size={12} />
              অ্যাডমিন
            </Badge>
          )}
          {user.isBanned ? (
            <Badge
              variant="destructive"
              className="text-[10px] uppercase font-bold"
            >
              নিষিদ্ধ (Banned)
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-bold text-emerald-600 border-emerald-500/30"
            >
              সক্রিয় (Active)
            </Badge>
          )}
          {user.emailVerified ? (
            <Badge variant="secondary" className="text-[10px]">
              ইমেইল ভেরিফাইড
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] text-amber-600 border-amber-500/30"
            >
              আনভেরিফাইড
            </Badge>
          )}
          {user.twoFactorEnabled && (
            <Badge variant="secondary" className="text-[10px]">
              ২FA চালু
            </Badge>
          )}
        </div>

        {statusMessage && (
          <div className="p-3 rounded-xl bg-accent text-xs font-medium text-foreground">
            {statusMessage}
          </div>
        )}

        {/* Profile Info Details */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            ব্যক্তিগত তথ্য
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-accent/40 border border-border/50 flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground">
                ফোন নম্বর
              </span>
              <span className="font-semibold text-foreground truncate">
                {user.phone || "সেট করা নেই"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-accent/40 border border-border/50 flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground">
                জন্ম তারিখ
              </span>
              <span className="font-semibold text-foreground truncate">
                {user.dob || "সেট করা নেই"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-accent/40 border border-border/50 flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground">
                নিবন্ধন তারিখ
              </span>
              <span className="font-semibold text-foreground truncate">
                {formatDateTime(user.createdAt)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-accent/40 border border-border/50 flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground">
                ইউজার আইডি
              </span>
              <span className="font-mono text-[10px] text-muted-foreground truncate">
                {user.id}
              </span>
            </div>
          </div>
        </div>

        {/* Plan Management with Select */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            সাবস্ক্রিপশন প্ল্যান পরিবর্তন
          </h4>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                value={selectedPlan}
                onValueChange={(val) => val && setSelectedPlan(val)}
              >
                <SelectTrigger className="w-full h-9 rounded-xl text-xs bg-background">
                  <SelectValue placeholder="প্ল্যান নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PLANS).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.price === 0 ? "ফ্রি" : `৳${p.price}/মাস`})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SubmitButton
              size="sm"
              onClick={handlePlanChange}
              isPending={isPending}
              className="rounded-xl text-xs shrink-0 cursor-pointer"
            >
              সেভ করুন
            </SubmitButton>
          </div>
        </div>

        {/* Security and Admin Actions */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            অ্যাডমিন ও সিকিউরিটি অ্যাকশন
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAdminToggle}
              disabled={isPending}
              className="justify-between text-xs rounded-xl cursor-pointer"
            >
              <span>{user.isAdmin ? "অ্যাডমিন প্রত্যাহার" : "অ্যাডমিন প্রদান"}</span>
              <CrownStar size={14} />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleVerifyEmail}
              disabled={isPending}
              className="justify-between text-xs rounded-xl cursor-pointer"
            >
              <span>
                {user.emailVerified ? "আনভেরিফাইড চিহ্নিত" : "ইমেইল ভেরিফাই"}
              </span>
              <CheckCircle size={14} />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRevokeSessions}
              disabled={isPending}
              className="justify-between text-xs rounded-xl cursor-pointer text-amber-600 hover:text-amber-700 sm:col-span-2"
            >
              <span>সমস্ত সক্রিয় সেশন বাতিল করুন</span>
              <Devices size={14} />
            </Button>

            <Button
              variant={user.isBanned ? "outline" : "destructive"}
              size="sm"
              onClick={handleBanToggle}
              disabled={isPending}
              className="justify-between text-xs rounded-xl cursor-pointer sm:col-span-2 mt-1"
            >
              <span>
                {user.isBanned
                  ? "ব্যবহারকারীকে আনব্যান করুন"
                  : "ব্যবহারকারীকে নিষিদ্ধ (Ban) করুন"}
              </span>
              <Danger size={14} />
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
