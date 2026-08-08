"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { DEVELOPER_NAV_ITEMS } from "@/lib/constants/ui";

export function NavDeveloper({ pathname }: { pathname: string }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {DEVELOPER_NAV_ITEMS.map((item) => {
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
