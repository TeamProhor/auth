"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Note } from "@/components/icons";
import { QuickList, QuickListItem } from "@/components/shared/quick-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PLANS } from "@/lib/constants/billing";
import { formatTimeAgo } from "@/lib/utils";
import {
  type SubscriptionItem,
  SubscriptionVerifyModal,
} from "./subscription-verify-modal";

interface SubscriptionListProps {
  items: SubscriptionItem[];
  total: number;
  pendingCount: number;
  page: number;
  totalPages: number;
  currentFilter: string;
  searchQuery: string;
}

export function SubscriptionList({
  items,
  total,
  pendingCount,
  page,
  totalPages,
  currentFilter,
  searchQuery,
}: SubscriptionListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchVal, setSearchVal] = useState(searchQuery);
  const [activeItem, setActiveItem] = useState<SubscriptionItem | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchVal.trim()) {
      params.set("search", searchVal.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/admin/subscriptions?${params.toString()}`);
  };

  const handleFilterChange = (filterVal: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filterVal === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filterVal);
    }
    params.set("page", "1");
    router.push(`/admin/subscriptions?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/admin/subscriptions?${params.toString()}`);
  };

  const filters = [
    { label: "সব", value: "all" },
    {
      label: "যাচাই অপেক্ষমান",
      value: "pending",
      count: pendingCount,
    },
    { label: "সক্রিয়", value: "active" },
    { label: "প্রত্যাখ্যাত", value: "rejected" },
    { label: "বাতিল", value: "canceled" },
    { label: "মেয়াদোত্তীর্ণ", value: "past_due" },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Pending Queue Highlight Alert */}
      {pendingCount > 0 && currentFilter !== "pending" && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              {pendingCount}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-foreground truncate">
                {pendingCount} টি নতুন পেমেন্ট যাচাইয়ের অপেক্ষায় রয়েছে
              </span>
              <span className="text-[11px] text-muted-foreground line-clamp-1">
                ব্যবহারকারীর সাবস্ক্রিপশন সক্রিয় করতে পেমেন্ট ও মেয়াদ যাচাই করে অনুমোদন করুন।
              </span>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => handleFilterChange("pending")}
            className="rounded-xl text-xs bg-amber-600 hover:bg-amber-700 text-white shrink-0 cursor-pointer w-full sm:w-auto"
          >
            অপেক্ষমান তালিকা দেখুন
          </Button>
        </div>
      )}

      {/* Controls: Filter Pills and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-1 px-1">
          {filters.map((f) => {
            const isActive = currentFilter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => handleFilterChange(f.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-accent/60 text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <span>{f.label}</span>
                {f.count !== undefined && f.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? "bg-background text-foreground"
                        : "bg-amber-500 text-white animate-pulse"
                    }`}
                  >
                    {f.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 w-full sm:max-w-xs"
        >
          <Input
            placeholder="নাম, ইমেইল বা পেমেন্ট মেথড..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="h-9 text-xs rounded-xl flex-1"
          />
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            className="rounded-xl text-xs shrink-0 cursor-pointer"
          >
            খুঁজুন
          </Button>
        </form>
      </div>

      {/* Clean QuickList (Mobile Responsive) */}
      <QuickList variant="list">
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 text-xs bg-card border border-border/80 rounded-2xl">
            কোনো সাবস্ক্রিপশন পাওয়া যায়নি।
          </div>
        ) : (
          items.map((item) => {
            const { subscription: sub, user } = item;
            const plan = PLANS[sub.planId] || { name: sub.planId, price: 0 };
            const initial = (
              user.name[0] ||
              user.email[0] ||
              "U"
            ).toUpperCase();

            return (
              <QuickListItem
                key={sub.id}
                color={
                  sub.status === "active"
                    ? "emerald"
                    : sub.status === "pending"
                      ? "amber"
                      : sub.status === "rejected"
                        ? "rose"
                        : "muted"
                }
                icon={
                  <Avatar className="size-8 sm:size-9 border border-border">
                    {user.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="text-[10px] sm:text-xs font-bold bg-primary/20 text-primary">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                }
                title={
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-foreground truncate max-w-[120px] sm:max-w-[200px]">
                      {user.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] sm:text-xs font-semibold px-1.5 py-0 h-4 sm:h-5"
                    >
                      {plan.name}
                    </Badge>
                    {sub.status === "active" ? (
                      <Badge
                        variant="outline"
                        className="text-[9px] sm:text-[10px] text-emerald-600 border-emerald-500/30 px-1 py-0 h-4"
                      >
                        Active
                      </Badge>
                    ) : sub.status === "pending" ? (
                      <Badge
                        variant="outline"
                        className="text-[9px] sm:text-[10px] text-amber-600 border-amber-500/50 bg-amber-500/10 font-bold px-1 py-0 h-4 animate-pulse"
                      >
                        Pending
                      </Badge>
                    ) : sub.status === "rejected" ? (
                      <Badge
                        variant="destructive"
                        className="text-[9px] sm:text-[10px] px-1 py-0 h-4"
                      >
                        Rejected
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[9px] sm:text-[10px] px-1 py-0 h-4"
                      >
                        {sub.status}
                      </Badge>
                    )}
                  </div>
                }
                description={
                  <span className="text-[10px] sm:text-xs text-muted-foreground truncate block">
                    {user.email} • {formatTimeAgo(sub.updatedAt)}
                  </span>
                }
                action={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setActiveItem(item)}
                    title="সাবস্ক্রিপশন ও পেমেন্ট বিবরণ দেখুন"
                    className="size-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer shrink-0"
                  >
                    <Note size={15} />
                  </Button>
                }
              />
            );
          })
        )}
      </QuickList>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground pt-2">
          <span className="text-center sm:text-left">
            মোট {total.toLocaleString("bn-BD")} টি সাবস্ক্রিপশন • পৃষ্ঠা {page} /{" "}
            {totalPages}
          </span>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="text-xs rounded-xl cursor-pointer"
            >
              পূর্ববর্তী
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="text-xs rounded-xl cursor-pointer"
            >
              পরবর্তী
            </Button>
          </div>
        </div>
      )}

      {/* Modular Verification & Details Modal */}
      <SubscriptionVerifyModal
        item={activeItem}
        onClose={() => setActiveItem(null)}
      />
    </div>
  );
}
