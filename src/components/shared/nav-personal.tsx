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
    title: "সার্ভিস ও ওভারভিউ",
    url: "/dashboard",
    icon: "solar:home-smile-bold-duotone",
  },
  {
    title: "প্রোফাইল ও তথ্য",
    url: "/dashboard/profile",
    icon: "solar:user-circle-bold-duotone",
  },
  {
    title: "নিরাপত্তা ও সেশন",
    url: "/dashboard/security",
    icon: "solar:shield-check-bold-duotone",
  },
  {
    title: "ডেটা ও গোপনীয়তা",
    url: "/dashboard/privacy",
    icon: "solar:lock-keyhole-bold-duotone",
  },
  {
    title: "পেমেন্ট ও ফ্যামিলি",
    url: "/dashboard/billing",
    icon: "solar:users-group-two-rounded-bold-duotone",
  },
  {
    title: "সেটিংস ও নোটিফিকেশন",
    url: "/dashboard/settings",
    icon: "solar:bell-bold-duotone",
  },
];

export function NavPersonal({ pathname }: { pathname: string }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            pathname === item.url ||
            (item.url !== "/dashboard" && pathname.startsWith(item.url));
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
