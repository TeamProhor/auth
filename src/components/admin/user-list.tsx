"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { UserDetailModal } from "@/components/admin/user-detail-modal";
import { Note } from "@/components/icons";
import { QuickList, QuickListItem } from "@/components/shared/quick-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PLANS } from "@/lib/constants/billing";
import { formatTimeAgo } from "@/lib/utils";

interface UserItem {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  phone: string | null;
  isAdmin: boolean;
  isBanned: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  subscription?: {
    planId: string;
    status: string;
  } | null;
}

interface UserListProps {
  users: UserItem[];
  total: number;
  page: number;
  totalPages: number;
  currentFilter: string;
  searchQuery: string;
}

export function UserList({
  users,
  total,
  page,
  totalPages,
  currentFilter,
  searchQuery,
}: UserListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchVal, setSearchVal] = useState(searchQuery);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchVal.trim()) {
      params.set("search", searchVal.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/admin/users?${params.toString()}`);
  };

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    params.set("page", "1");
    router.push(`/admin/users?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/admin/users?${params.toString()}`);
  };

  const filters = [
    { label: "সব ইউজার", value: "all" },
    { label: "অ্যাডমিন", value: "admin" },
    { label: "নিষিদ্ধ (Banned)", value: "banned" },
    { label: "আনভেরিফাইড", value: "unverified" },
    { label: "ভেরিফাইড", value: "verified" },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Controls: Search and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-1 px-1">
          {filters.map((f) => {
            const isActive = currentFilter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => handleFilterChange(f.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-accent/60 text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 w-full sm:max-w-xs"
        >
          <Input
            placeholder="নাম, ইমেইল বা ফোন খুঁজুন..."
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

      {/* Users QuickList (Mobile Responsive) */}
      <QuickList variant="list">
        {users.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 text-xs bg-card border border-border/80 rounded-2xl">
            কোনো ব্যবহারকারী পাওয়া যায়নি।
          </div>
        ) : (
          users.map((u) => {
            const initial = (u.name[0] || u.email[0] || "U").toUpperCase();
            const planKey = u.subscription?.planId || "prohor-free";
            const plan = PLANS[planKey] || { name: planKey };

            return (
              <QuickListItem
                key={u.id}
                color={u.isBanned ? "rose" : u.isAdmin ? "purple" : "emerald"}
                icon={
                  <Avatar className="size-8 sm:size-9 border border-border">
                    {u.avatarUrl ? (
                      <AvatarImage src={u.avatarUrl} alt={u.name} />
                    ) : null}
                    <AvatarFallback className="text-[10px] sm:text-xs font-bold bg-primary/20 text-primary">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                }
                title={
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-foreground truncate max-w-[130px] sm:max-w-[200px]">
                      {u.name}
                    </span>
                    {u.isAdmin && (
                      <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-[9px] sm:text-[10px] px-1.5 py-0 h-4 font-bold">
                        Admin
                      </Badge>
                    )}
                    {u.isBanned ? (
                      <Badge
                        variant="destructive"
                        className="text-[9px] sm:text-[10px] px-1.5 py-0 h-4"
                      >
                        Banned
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[9px] sm:text-[10px] px-1.5 py-0 h-4 text-emerald-600 border-emerald-500/30"
                      >
                        Active
                      </Badge>
                    )}
                    {u.emailVerified ? (
                      <Badge
                        variant="secondary"
                        className="text-[9px] sm:text-[10px] px-1.5 py-0 h-4"
                      >
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[9px] sm:text-[10px] px-1.5 py-0 h-4 text-amber-600 border-amber-500/30"
                      >
                        Unverified
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="text-[9px] sm:text-[10px] px-1.5 py-0 h-4"
                    >
                      {plan.name}
                    </Badge>
                  </div>
                }
                description={
                  <span className="text-[10px] sm:text-xs text-muted-foreground truncate block">
                    {u.email} • নিবন্ধন: {formatTimeAgo(u.createdAt)}
                  </span>
                }
                action={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedUser(u)}
                    title="ব্যবহারকারী পরিচালনা ও বিবরণ"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground pt-2">
          <span className="text-center sm:text-left">
            মোট {total.toLocaleString("bn-BD")} জন ব্যবহারকারী • পৃষ্ঠা {page} /{" "}
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

      {/* User Detail Responsive Modal */}
      {selectedUser && (
        <UserDetailModal
          user={{
            ...selectedUser,
            dob: null,
            gender: null,
            bio: null,
          }}
          open={!!selectedUser}
          onOpenChange={(open) => {
            if (!open) setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
