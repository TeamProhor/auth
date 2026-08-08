"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "অ্যাপস ও ওয়েবহুক",
    url: "/developer/apps",
    icon: "solar:box-minimalistic-bold",
  },
  {
    title: "ইউজার ডিরেক্টরি",
    url: "/developer/users",
    icon: "solar:users-group-rounded-bold",
  },
  {
    title: "রোল ও পারমিশন",
    url: "/developer/rbac",
    icon: "solar:shield-keyhole-bold",
  },
  {
    title: "লগইন অ্যাকশনস",
    url: "/developer/hooks",
    icon: "solar:code-file-bold",
  },
  {
    title: "বট প্রোটেকশন",
    url: "/developer/protection",
    icon: "solar:shield-warning-bold",
  },
  {
    title: "অ্যানালিটিক্স ও কোটা",
    url: "/developer/analytics",
    icon: "solar:chart-square-bold",
  },
  {
    title: "কুইকস্টার্ট ও SDK",
    url: "/developer/quickstart",
    icon: "solar:rocket-bold",
  },
  {
    title: "এপিআই ডকস",
    url: "/developer/docs",
    icon: "solar:document-text-bold",
  },
];

export function NavDeveloper({ pathname }: { pathname: string }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            pathname === item.url ||
            (item.url !== "/developer" && pathname.startsWith(item.url));
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                render={<Link href={item.url} />}
                isActive={isActive}
                tooltip={item.title}
                className="py-5 px-3 rounded-xl mb-1"
              >
                <Icon
                  icon={item.icon}
                  width="24"
                  height="24"
                  className="shrink-0"
                />
                <span className="text-sm font-semibold ml-2">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
