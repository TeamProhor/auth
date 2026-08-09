"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { banUserAction, unbanUserAction } from "@/actions/admin";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const bnDateOnlyFormatter = new Intl.DateTimeFormat("bn", {
  dateStyle: "medium",
});
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface UserRow {
  user: User;
  consent: UserConsent;
}

interface UsersPageClientProps {
  users: UserRow[];
  total: number;
  apps: Array<{ clientId: string; name: string }>;
  page: number;
  pageSize: number;
}

export function UsersPageClient({
  users,
  total,
  apps,
  page,
  pageSize,
}: UsersPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [appFilter, setAppFilter] = useState("all");
  const [confirmUser, setConfirmUser] = useState<User | null>(null);
  const [confirmAction, setConfirmAction] = useState<"ban" | "unban" | null>(
    null,
  );

  const totalPages = Math.ceil(total / pageSize);

  // Client-side search filter
  const filtered = users.filter(({ user, consent }) => {
    const matchesSearch =
      !search.trim() ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesApp = appFilter === "all" || consent.clientId === appFilter;
    return matchesSearch && matchesApp;
  });

  const handleBanAction = (user: User) => {
    setConfirmUser(user);
    setConfirmAction(user.isBanned ? "unban" : "ban");
  };

  const confirmBanAction = () => {
    if (!confirmUser || !confirmAction) return;
    startTransition(async () => {
      if (confirmAction === "ban") {
        await banUserAction(confirmUser.id);
      } else {
        await unbanUserAction(confirmUser.id);
      }
      setConfirmUser(null);
      setConfirmAction(null);
      router.refresh();
    });
  };

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            ইউজার ডিরেক্টরি
          </h2>
          <p className="text-muted-foreground text-sm">
            আপনার অ্যাপ্লিকেশনে সাইন আপ করা{" "}
            <span className="font-semibold text-foreground">{total}জন</span>{" "}
            ব্যবহারকারী।
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* App filter */}
          {apps.length > 1 && (
            <Select
              value={appFilter}
              onValueChange={(value) => setAppFilter(value ?? "all")}
            >
              <SelectTrigger className="w-44 rounded-xl">
                <SelectValue placeholder="সব অ্যাপ" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">সব অ্যাপ</SelectItem>
                  {apps.map((app) => (
                    <SelectItem key={app.clientId} value={app.clientId}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          {/* Search */}
          <InputGroup className="w-64">
            <InputGroupAddon align="inline-start">
              <Icon
                icon="solar:magnifer-linear"
                width="18"
                height="18"
                className="text-muted-foreground"
              />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="ইমেইল বা নাম খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      {/* Users Table */}
      {filtered.length === 0 ? (
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
      ) : (
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
                  <TableRow
                    key={`${user.id}-${consent.clientId}`}
                    className={user.isBanned ? "opacity-60" : ""}
                  >
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          {user.avatarUrl && (
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                          )}
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p
                            className={`font-semibold text-foreground text-sm ${
                              user.isBanned ? "line-through" : ""
                            }`}
                          >
                            {user.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-muted-foreground text-xs">
                      {user.createdAt ? bnDateOnlyFormatter.format(user.createdAt) : "—"}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                        {appName}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      {user.isBanned ? (
                        <Badge variant="destructive" className="font-bold">
                          ব্যানড
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-500 font-bold"
                        >
                          অ্যাক্টিভ
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            />
                          }
                        >
                          <Icon
                            icon="solar:menu-dots-bold"
                            width="18"
                            height="18"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleBanAction(user)}
                            >
                              {user.isBanned ? "অনব্যান করুন" : "ব্যান করুন"}
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
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
                      onClick={() => router.push(`?page=${page - 1}`)}
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
                      onClick={() => router.push(`?page=${page + 1}`)}
                    >
                      পরের
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Card>
      )}

      {/* Ban/Unban Confirmation Dialog */}
      <Dialog
        open={!!confirmUser}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmUser(null);
            setConfirmAction(null);
          }
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
            <DialogClose render={<Button variant="outline" />}>
              বাতিল
            </DialogClose>
            <SubmitButton
              variant={confirmAction === "ban" ? "destructive" : "default"}
              onClick={confirmBanAction}
              type="button"
              isPending={isPending}
              pendingText="হচ্ছে..."
            >
              {confirmAction === "ban" ? "ব্যান করুন" : "অনব্যান করুন"}
            </SubmitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
