"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { UserRow } from "@/components/developer/user-row";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User, UserConsent } from "@/db/schema";

interface UserItem {
  user: User;
  consent: UserConsent;
}

interface UsersTableProps {
  filtered: UserItem[];
  total: number;
  apps: Array<{ clientId: string; name: string }>;
  page: number;
  totalPages: number;
  isPending: boolean;
  search: string;
  appFilter: string;
  onPageChange: (newPage: number) => void;
  onBanAction: (user: User) => void;
}

export function UsersTable({
  filtered,
  total,
  apps,
  page,
  totalPages,
  isPending,
  search,
  appFilter,
  onPageChange,
  onBanAction,
}: UsersTableProps) {
  if (filtered.length === 0) {
    return (
      <Card className="p-16 text-center text-muted-foreground">
        <Icon
          icon="solar:users-group-rounded-bold"
          width="40"
          height="40"
          className="mx-auto mb-4 opacity-30"
        />
        <p className="font-semibold">
          {search || appFilter !== "all"
            ? "কোনো ফলাফল পাওয়া যায়নি"
            : "এখনো কোনো ব্যবহারকারী নেই"}
        </p>
        {!search && appFilter === "all" && (
          <p className="text-sm mt-1">
            আপনার OAuth অ্যাপে কেউ লগইন করলে এখানে দেখা যাবে।
          </p>
        )}
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-sm p-0">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="px-5 py-3.5 font-bold">ইউজার</TableHead>
            <TableHead className="px-5 py-3.5 font-bold">সাইন আপ</TableHead>
            <TableHead className="px-5 py-3.5 font-bold">অ্যাপ</TableHead>
            <TableHead className="px-5 py-3.5 font-bold">স্ট্যাটাস</TableHead>
            <TableHead className="px-5 py-3.5 font-bold text-right">
              অ্যাকশন
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(({ user, consent }) => {
            const appName =
              apps.find((a) => a.clientId === consent.clientId)?.name ??
              consent.clientId;

            return (
              <UserRow
                key={`${user.id}-${consent.clientId}`}
                user={user}
                consentClientId={consent.clientId}
                appName={appName}
                onBanAction={onBanAction}
              />
            );
          })}
        </TableBody>
        <TableFooter className="bg-muted/20 border-t border-border">
          <TableRow>
            <TableCell
              colSpan={3}
              className="px-5 py-4 text-sm text-muted-foreground font-normal"
            >
              দেখানো হচ্ছে {filtered.length}টি / মোট {total}জন
            </TableCell>
            <TableCell colSpan={2} className="px-5 py-4 text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isPending}
                  onClick={() => onPageChange(page - 1)}
                >
                  আগের
                </Button>
                <span className="flex items-center px-3 text-xs text-muted-foreground">
                  {page} / {Math.max(1, totalPages)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || isPending}
                  onClick={() => onPageChange(page + 1)}
                >
                  পরের
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
}
