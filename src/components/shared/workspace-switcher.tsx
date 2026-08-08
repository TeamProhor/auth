"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function WorkspaceSwitcher({ isDeveloper }: { isDeveloper: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            className="w-full flex items-center justify-between px-3 py-6 bg-background border border-border rounded-xl cursor-pointer hover:border-ring transition-colors shadow-sm mb-2"
          />
        }
        className="outline-none border-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
            {isDeveloper ? (
              <Icon
                icon="solar:code-square-bold-duotone"
                width="14"
                height="14"
              />
            ) : (
              <Icon icon="solar:user-id-bold-duotone" width="14" height="14" />
            )}
          </div>
          <span className="text-sm font-semibold text-foreground">
            {isDeveloper ? "ডেভেলপার পোর্টাল" : "ব্যক্তিগত অ্যাকাউন্ট"}
          </span>
        </div>
        <Icon
          icon="solar:alt-arrow-down-bold-duotone"
          width="16"
          height="16"
          className="text-muted-foreground"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 rounded-xl border border-border"
        align="start"
      >
        <DropdownMenuItem
          render={<Link href="/dashboard" />}
          className="p-3 cursor-pointer w-full flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-sm">
            <Icon icon="solar:user-id-bold-duotone" width="18" height="18" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-foreground">
              ব্যক্তিগত অ্যাকাউন্ট
            </p>
            <p className="text-xs text-muted-foreground">
              সার্ভিস, স্টোরেজ ও সেটিংস
            </p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          render={<Link href="/developer" />}
          className="p-3 cursor-pointer w-full flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-md border border-border bg-background text-foreground flex items-center justify-center text-sm font-bold shadow-sm">
            <Icon
              icon="solar:code-square-bold-duotone"
              width="18"
              height="18"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-foreground">
              ডেভেলপার পোর্টাল
            </p>
            <p className="text-xs text-muted-foreground">
              অ্যাপ, এপিআই ও অ্যানালিটিক্স
            </p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
