"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function UserDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            className="flex items-center gap-3 px-2 py-6 rounded-xl hover:bg-accent transition-colors overflow-hidden w-full cursor-pointer text-left border-none outline-none mt-2"
          />
        }
      >
        <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
          <Icon icon="solar:user-linear" width="20" height="20" />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className="text-sm font-semibold text-foreground truncate">
            ব্যবহারকারীর নাম
          </span>
          <span className="text-[11px] text-muted-foreground truncate">
            user@example.com
          </span>
        </div>
        <Icon
          icon="solar:alt-arrow-down-bold-duotone"
          width="16"
          height="16"
          className="text-muted-foreground shrink-0"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 rounded-xl border border-border mb-2"
        align="start"
        side="top"
      >
        <div className="p-2">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-accent">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              U
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-xs font-bold text-foreground truncate">
                ব্যবহারকারীর নাম
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                user@example.com
              </span>
            </div>
            <Icon
              icon="solar:check-circle-bold-duotone"
              width="16"
              height="16"
              className="text-chart-2 shrink-0"
            />
          </div>
          <DropdownMenuItem className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent transition-colors w-full mt-1 text-left cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground text-xs shrink-0">
              <Icon icon="solar:case-bold-duotone" width="14" height="14" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-foreground truncate">
                ওয়ার্ক অ্যাকাউন্ট
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                work@prohor.app
              </span>
            </div>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="bg-border/50" />
        <div className="p-1">
          <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent rounded-lg cursor-pointer">
            <Icon icon="solar:add-circle-bold-duotone" width="16" height="16" />{" "}
            অন্য অ্যাকাউন্ট যোগ করুন
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<Link href="/login" />}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg cursor-pointer"
          >
            <Icon icon="solar:logout-2-bold-duotone" width="16" height="16" />{" "}
            সব থেকে লগআউট
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
