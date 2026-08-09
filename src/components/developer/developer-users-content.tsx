"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { banUserAction, unbanUserAction } from "@/actions/admin";
import { BanConfirmDialog } from "@/components/developer/ban-confirm-dialog";
import { UsersFilterHeader } from "@/components/developer/users-filter-header";
import { UsersTable } from "@/components/developer/users-table";
import type { User, UserConsent } from "@/db/schema";

interface UserRowItem {
  user: User;
  consent: UserConsent;
}

interface DeveloperUsersContentProps {
  users: UserRowItem[];
  total: number;
  apps: Array<{ clientId: string; name: string }>;
  page: number;
  pageSize: number;
}

export function DeveloperUsersContent({
  users,
  total,
  apps,
  page,
  pageSize,
}: DeveloperUsersContentProps) {
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
      <UsersFilterHeader
        total={total}
        apps={apps}
        appFilter={appFilter}
        onAppFilterChange={setAppFilter}
        search={search}
        onSearchChange={setSearch}
      />

      <UsersTable
        filtered={filtered}
        total={total}
        apps={apps}
        page={page}
        totalPages={totalPages}
        isPending={isPending}
        search={search}
        appFilter={appFilter}
        onPageChange={(newPage) => router.push(`?page=${newPage}`)}
        onBanAction={handleBanAction}
      />

      <BanConfirmDialog
        confirmUser={confirmUser}
        confirmAction={confirmAction}
        isPending={isPending}
        onClose={() => {
          setConfirmUser(null);
          setConfirmAction(null);
        }}
        onConfirm={confirmBanAction}
      />
    </div>
  );
}
