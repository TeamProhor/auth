"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  approveSubscriptionAction,
  overrideSubscriptionAction,
  rejectSubscriptionAction,
} from "@/actions/admin-subscriptions";
import { Calendar, CloudDownload, Danger } from "@/components/icons";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PLANS } from "@/lib/constants/billing";
import { formatDateTime } from "@/lib/utils";

export interface SubscriptionItem {
  subscription: {
    id: string;
    userId: string;
    planId: string;
    status: string;
    paymentMethod: string | null;
    rejectionReason?: string | null;
    currentPeriodStart: Date;
    currentPeriodEnd: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  latestInvoice?: {
    id: string;
    amount: number;
    planName: string;
    paymentMethod: string;
    status: string;
    createdAt: Date;
  } | null;
}

interface SubscriptionVerifyModalProps {
  item: SubscriptionItem | null;
  onClose: () => void;
}

export function SubscriptionVerifyModal({
  item,
  onClose,
}: SubscriptionVerifyModalProps) {
  const router = useRouter();
  const [durationOption, setDurationOption] = useState<string>("1");
  const [customDate, setCustomDate] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const [targetPlan, setTargetPlan] = useState<string>("prohor-pro");
  const [targetStatus, setTargetStatus] = useState<
    "active" | "pending" | "canceled" | "rejected" | "past_due"
  >("active");

  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (item) {
      setTargetPlan(item.subscription.planId);
      setTargetStatus(item.subscription.status);
      setDurationOption("1");
      setCustomDate("");
      setRejectionReason(item.subscription.rejectionReason || "");
      setIsRejecting(false);
      setFeedback(null);
    }
  }, [item]);

  if (!item) return null;

  const plan = PLANS[item.subscription.planId] || {
    name: item.subscription.planId,
    price: 0,
  };
  const isPendingVerification = item.subscription.status === "pending";

  const handleApprove = () => {
    startTransition(async () => {
      const durationMonths =
        durationOption === "custom" ? 1 : Number(durationOption);
      const customEndDate =
        durationOption === "custom" ? customDate : undefined;

      const res = await approveSubscriptionAction(
        item.user.id,
        durationMonths,
        customEndDate,
      );

      if (res.success) {
        setFeedback({
          type: "success",
          text: res.message || "সাবস্ক্রিপশন সফলভাবে অনুমোদিত হয়েছে।",
        });
        setTimeout(() => {
          onClose();
          router.refresh();
        }, 1000);
      } else {
        setFeedback({ type: "error", text: res.error });
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const res = await rejectSubscriptionAction(item.user.id, rejectionReason);

      if (res.success) {
        setFeedback({
          type: "success",
          text: res.message || "সাবস্ক্রিপশন প্রত্যাখ্যান করা হয়েছে।",
        });
        setTimeout(() => {
          onClose();
          router.refresh();
        }, 1000);
      } else {
        setFeedback({ type: "error", text: res.error });
      }
    });
  };

  const handleSaveOverride = () => {
    startTransition(async () => {
      const res = await overrideSubscriptionAction(
        item.user.id,
        targetPlan,
        targetStatus,
      );

      if (res.success) {
        setFeedback({
          type: "success",
          text: res.message || "সাবস্ক্রিপশন সংরক্ষিত হয়েছে।",
        });
        setTimeout(() => {
          onClose();
          router.refresh();
        }, 1000);
      } else {
        setFeedback({ type: "error", text: res.error });
      }
    });
  };

  return (
    <ResponsiveDialog
      open={!!item}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="সাবস্ক্রিপশন ও পেমেন্ট যাচাই"
      description="ব্যবহারকারীর নির্বাচিত প্ল্যান, পেমেন্ট মাধ্যম এবং মেয়াদ যাচাই ও ব্যবস্থাপনা করুন।"
      trigger={null}
      className="sm:max-w-lg"
    >
      <div className="flex flex-col gap-5 pt-2 text-left">
        {/* Feedback Message */}
        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs font-medium ${
              feedback.type === "success"
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* User & Plan Overview Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-10 border border-border shrink-0">
                {item.user.avatarUrl ? (
                  <AvatarImage src={item.user.avatarUrl} alt={item.user.name} />
                ) : null}
                <AvatarFallback className="text-xs font-bold bg-primary/20 text-primary">
                  {(item.user.name[0] || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-foreground truncate">
                  {item.user.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {item.user.email}
                </span>
              </div>
            </div>

            {/* Print Invoice Button if invoice exists */}
            {item.latestInvoice && (
              <Button
                variant="outline"
                size="sm"
                render={
                  <Link
                    href={`/print/invoice/${item.latestInvoice.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CloudDownload size={13} />
                    ইনভয়েস প্রিন্ট
                  </Link>
                }
                className="text-xs rounded-xl gap-1.5 shrink-0 cursor-pointer"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-border/60 text-xs">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[11px]">প্ল্যান</span>
              <span className="font-semibold text-foreground">
                {plan.name} (৳{plan.price})
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[11px]">
                পেমেন্ট মাধ্যম
              </span>
              <span className="font-semibold text-foreground">
                {item.subscription.paymentMethod || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[11px]">
                বর্তমান স্ট্যাটাস
              </span>
              <span>
                {item.subscription.status === "active" ? (
                  <Badge
                    variant="outline"
                    className="text-[10px] text-emerald-600 border-emerald-500/30"
                  >
                    Active
                  </Badge>
                ) : item.subscription.status === "pending" ? (
                  <Badge
                    variant="outline"
                    className="text-[10px] text-amber-600 border-amber-500/50 bg-amber-500/10 font-bold"
                  >
                    Pending Verification
                  </Badge>
                ) : item.subscription.status === "rejected" ? (
                  <Badge variant="destructive" className="text-[10px]">
                    Rejected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px]">
                    {item.subscription.status}
                  </Badge>
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[11px]">
                মেয়াদ উত্তীর্ণের তারিখ
              </span>
              <span className="font-medium text-foreground">
                {item.subscription.currentPeriodEnd
                  ? formatDateTime(item.subscription.currentPeriodEnd)
                  : "অনুমোদনের পর কার্যকর হবে"}
              </span>
            </div>
          </div>

          {item.subscription.rejectionReason && (
            <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
              <strong>পূর্ববর্তী প্রত্যাখ্যানের কারণ:</strong>{" "}
              {item.subscription.rejectionReason}
            </div>
          )}
        </div>

        {/* Pending Verification Action Mode */}
        {isPendingVerification && !isRejecting && (
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-accent/40 border border-border/80">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" />
              সাবস্ক্রিপশনের মেয়াদ নির্ধারণ (Approval Duration)
            </h4>
            <div className="flex flex-col gap-2">
              <Select
                value={durationOption}
                onValueChange={(val) => setDurationOption(val || "1")}
              >
                <SelectTrigger className="w-full h-9 rounded-xl text-xs bg-background">
                  <SelectValue placeholder="মেয়াদ নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">১ মাস (1 Month - Standard)</SelectItem>
                  <SelectItem value="3">৩ মাস (3 Months)</SelectItem>
                  <SelectItem value="6">৬ মাস (6 Months)</SelectItem>
                  <SelectItem value="12">১ বছর (1 Year)</SelectItem>
                  <SelectItem value="custom">
                    নির্দিষ্ট তারিখ নির্বাচন করুন (Custom Date)
                  </SelectItem>
                </SelectContent>
              </Select>

              {durationOption === "custom" && (
                <Input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/60">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRejecting(true)}
                disabled={isPending}
                className="text-xs text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer"
              >
                প্রত্যাখ্যান মোড
              </Button>
              <SubmitButton
                variant="default"
                size="sm"
                onClick={handleApprove}
                isPending={isPending}
                className="rounded-xl text-xs font-semibold cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                মেয়াদ সহ অনুমোদন করুন
              </SubmitButton>
            </div>
          </div>
        )}

        {/* Rejection Form Mode */}
        {isPendingVerification && isRejecting && (
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-destructive/5 border border-destructive/20">
            <h4 className="text-xs font-bold text-destructive flex items-center gap-1.5">
              <Danger size={14} />
              পেমেন্ট প্রত্যাখ্যানের কারণ
            </h4>
            <Input
              placeholder="যেমন: bKash TrxID মেলেনি বা পেমেন্ট পাওয়া যায়নি"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="h-9 text-xs rounded-xl"
            />

            <div className="flex items-center justify-between gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRejecting(false)}
                disabled={isPending}
                className="text-xs rounded-xl cursor-pointer"
              >
                অনুমোদন মোডে ফিরুন
              </Button>
              <SubmitButton
                variant="destructive"
                size="sm"
                onClick={handleReject}
                isPending={isPending}
                className="rounded-xl text-xs font-semibold cursor-pointer"
              >
                প্রত্যাখ্যান নিশ্চিত করুন
              </SubmitButton>
            </div>
          </div>
        )}

        {/* Manual Override for Active or other states */}
        {!isPendingVerification && (
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-accent/40 border border-border/80">
            <h4 className="text-xs font-bold text-foreground">
              ম্যানুয়াল প্ল্যান ও স্ট্যাটাস পরিবর্তন
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-muted-foreground font-medium">
                  প্ল্যান
                </span>
                <Select
                  value={targetPlan}
                  onValueChange={(val) => val && setTargetPlan(val)}
                >
                  <SelectTrigger className="w-full h-9 rounded-xl text-xs bg-background">
                    <SelectValue placeholder="প্ল্যান" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PLANS).map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-muted-foreground font-medium">
                  স্ট্যাটাস
                </span>
                <Select
                  value={targetStatus}
                  onValueChange={(val) =>
                    val &&
                    setTargetStatus(
                      val as
                        | "active"
                        | "pending"
                        | "canceled"
                        | "rejected"
                        | "past_due",
                    )
                  }
                >
                  <SelectTrigger className="w-full h-9 rounded-xl text-xs bg-background">
                    <SelectValue placeholder="স্ট্যাটাস" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                    <SelectItem value="past_due">Past Due</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <SubmitButton
                size="sm"
                onClick={handleSaveOverride}
                isPending={isPending}
                className="rounded-xl text-xs cursor-pointer"
              >
                পরিবর্তন সংরক্ষণ করুন
              </SubmitButton>
            </div>
          </div>
        )}
      </div>
    </ResponsiveDialog>
  );
}
