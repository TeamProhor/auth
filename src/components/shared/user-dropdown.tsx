"use client";

import { Icon } from "@iconify/react";
import { useTransition } from "react";
import { logoutAction } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import type { User } from "@/db/schema";

interface UserDropdownProps {
  user?: User | null;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isPending, startTransition] = useTransition();

  const name = user?.name || "ব্যবহারকারী";
  const email = user?.email || "";
  const avatarUrl = user?.avatarUrl || undefined;
  const initial = (name[0] || email[0] || "U").toUpperCase();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            className="flex items-center gap-3 px-2 py-6 rounded-xl hover:bg-accent transition-colors overflow-hidden w-full cursor-pointer text-left border-none outline-none mt-2 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:justify-center"
          />
        }
      >
        <Avatar className="size-9 shrink-0">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-primary/20 text-primary font-bold text-sm">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
          <span className="text-sm font-semibold text-foreground truncate">
            {name}
          </span>
          <span className="text-[11px] text-muted-foreground truncate">
            {email}
          </span>
        </div>
        <Icon
          icon="solar:alt-arrow-down-bold"
          width="16"
          height="16"
          className="text-muted-foreground shrink-0 group-data-[collapsible=icon]:hidden"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 rounded-xl border border-border mb-2"
        align="start"
        side="top"
      >
        <div className="p-2">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-accent">
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-xs font-bold text-foreground truncate">
                {name}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {email}
              </span>
            </div>
            <Icon
              icon="solar:check-circle-bold"
              width="16"
              height="16"
              className="text-chart-2 shrink-0"
            />
          </div>
        </div>
        <DropdownMenuSeparator className="bg-border/50" />
        <div className="p-1">
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg cursor-pointer disabled:opacity-50"
          >
            <Icon icon="solar:logout-2-bold" width="16" height="16" />
            {isPending ? "লগআউট হচ্ছে..." : "লগআউট"}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
