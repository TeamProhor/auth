"use client";

import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavDeveloper } from "./nav-developer";
import { NavPersonal } from "./nav-personal";
import { UserDropdown } from "./user-dropdown";
import { WorkspaceSwitcher } from "./workspace-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isDeveloper = pathname.startsWith("/developer");
  const { setTheme, theme } = useTheme();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props} className="border-border">
      <SidebarHeader className="pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full px-2 py-1 mb-2">
              <div className="flex items-center hover:bg-accent rounded-lg transition-colors overflow-hidden shrink-0 w-full cursor-pointer">
                <Icon
                  icon="solar:shield-bold-duotone"
                  width="24"
                  height="24"
                  className="shrink-0 mr-3 text-foreground"
                />
                <h3 className="font-[800] text-[16px] whitespace-nowrap mt-1">
                  প্রহর হাব
                </h3>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <WorkspaceSwitcher isDeveloper={isDeveloper} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {isDeveloper ? (
          <NavDeveloper pathname={pathname} />
        ) : (
          <NavPersonal pathname={pathname} />
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border pt-4">
        <SidebarMenu>
          <SidebarMenuItem className="hidden group-data-[collapsible=icon]:hidden lg:flex items-center justify-between px-2 pb-2">
            <button
              type="button"
              aria-label="থিম পরিবর্তন করুন (Toggle Theme)"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-foreground hover:bg-accent p-1.5 rounded-full border border-border transition-colors cursor-pointer flex items-center justify-center"
            >
              <Icon
                icon="line-md:sunny-filled-loop-to-moon-filled-loop-transition"
                className="hidden dark:block"
                width="18"
                height="18"
              />
              <Icon
                icon="line-md:moon-filled-to-sunny-filled-loop-transition"
                className="dark:hidden block"
                width="18"
                height="18"
              />
            </button>
            <button
              type="button"
              aria-label="সাইডবার সংকুচিত করুন (Toggle Sidebar)"
              onClick={toggleSidebar}
              className="text-muted-foreground hover:text-foreground p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <Icon
                icon="solar:double-alt-arrow-left-bold-duotone"
                width="20"
                height="20"
              />
            </button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <UserDropdown />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
