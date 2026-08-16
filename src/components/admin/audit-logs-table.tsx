"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatTimeAgo } from "@/lib/utils";

interface AuditLogItem {
  log: {
    id: string;
    userId: string | null;
    eventType: string;
    ipAddress: string | null;
    details: string | null;
    createdAt: Date;
  };
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  } | null;
}

interface AuditLogsTableProps {
  items: AuditLogItem[];
  total: number;
  page: number;
  totalPages: number;
  currentType: string;
  searchQuery: string;
}

export function AuditLogsTable({
  items,
  total,
  page,
  totalPages,
  currentType,
  searchQuery,
}: AuditLogsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchVal, setSearchVal] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchVal.trim()) {
      params.set("search", searchVal.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/admin/audit-logs?${params.toString()}`);
  };

  const handleTypeChange = (eventType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (eventType === "all") {
      params.delete("type");
    } else {
      params.set("type", eventType);
    }
    params.set("page", "1");
    router.push(`/admin/audit-logs?${params.toString()}`);
  };

  const eventTypes = [
    { label: "সব ইভেন্ট", value: "all" },
    { label: "Login", value: "login" },
    { label: "Register", value: "register" },
    { label: "Password Change", value: "password_change" },
    { label: "Session Revoked", value: "session_revoked" },
    { label: "User Banned", value: "user_banned" },
    { label: "OAuth Link", value: "oauth_account_linked" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {eventTypes.map((t) => {
            const isActive = (currentType || "all") === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => handleTypeChange(t.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-accent/60 text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 max-w-xs w-full"
        >
          <Input
            placeholder="IP, ডিটেইলস বা ইমেইল খুঁজুন..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="h-9 text-xs rounded-xl"
          />
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            className="rounded-xl text-xs shrink-0 cursor-pointer"
          >
            অনুসন্ধান
          </Button>
        </form>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs font-bold">ইভেন্ট টাইপ</TableHead>
              <TableHead className="text-xs font-bold">ব্যবহারকারী</TableHead>
              <TableHead className="text-xs font-bold">আইপি এড্রেস</TableHead>
              <TableHead className="text-xs font-bold">বিস্তারিত</TableHead>
              <TableHead className="text-xs font-bold text-right">
                সময়
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-xs text-muted-foreground"
                >
                  কোনো সিকিউরিটি অডিট লগ পাওয়া যায়নি।
                </TableCell>
              </TableRow>
            ) : (
              items.map(({ log, user }) => (
                <TableRow
                  key={log.id}
                  className="hover:bg-accent/40 transition-colors text-xs"
                >
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase font-bold px-2 py-0.5"
                    >
                      {log.eventType.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {user ? (
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        সিস্টেম / অতিথি
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {log.ipAddress || "—"}
                    </span>
                  </TableCell>

                  <TableCell className="max-w-xs truncate text-muted-foreground text-[11px]">
                    {log.details || "—"}
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground text-[11px]">
                    <div className="flex flex-col items-end">
                      <span>{formatTimeAgo(log.createdAt)}</span>
                      <span className="text-[9px] opacity-70">
                        {formatDateTime(log.createdAt)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>
            মোট {total.toLocaleString("bn-BD")} টি লগ • পৃষ্ঠা {page} /{" "}
            {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (page - 1).toString());
                router.push(`/admin/audit-logs?${params.toString()}`);
              }}
              className="text-xs rounded-xl cursor-pointer"
            >
              পূর্ববর্তী
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (page + 1).toString());
                router.push(`/admin/audit-logs?${params.toString()}`);
              }}
              className="text-xs rounded-xl cursor-pointer"
            >
              পরবর্তী
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
