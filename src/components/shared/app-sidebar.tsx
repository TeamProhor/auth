"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import type * as React from "react";
import { ProhorLogo } from "@/components/shared/prohor-logo";
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
import type { User } from "@/db/schema";
import { NavDeveloper } from "./nav-developer";
import { NavPersonal } from "./nav-personal";
import { UserDropdown } from "./user-dropdown";
import { WorkspaceSwitcher } from "./workspace-switcher";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user?: User | null }) {
  const pathname = usePathname();
  const isDeveloper = pathname.startsWith("/developer");
  const { setTheme, theme } = useTheme();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props} className="border-border">
      <SidebarHeader className="pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full px-2 py-1 mb-2 group-data-[collapsible=icon]:px-0">
              <div className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-accent rounded-lg transition-colors cursor-pointer w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                <ProhorLogo className="size-6 shrink-0 rounded" />
                <h3 className="font-extrabold text-base whitespace-nowrap text-foreground group-data-[collapsible=icon]:hidden">
                  অ্যাকাউন্ট
                </h3>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <WorkspaceSwitcher
              isDeveloper={isDeveloper}
              userIsDeveloper={user?.isDeveloper ?? false}
            />
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
          <SidebarMenuItem className="flex items-center justify-between px-2 pb-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:px-0">
            <button
              type="button"
              aria-label="থিম পরিবর্তন করুন (Toggle Theme)"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-foreground hover:bg-accent p-1.5 rounded-full border border-border transition-colors cursor-pointer flex items-center justify-center shrink-0"
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
              aria-label="সাইডবার প্রসারণ / সংকুচিত করুন (Toggle Sidebar)"
              onClick={toggleSidebar}
              className="text-muted-foreground hover:text-foreground p-1.5 rounded-full transition-colors cursor-pointer shrink-0"
            >
              <Icon
                icon="solar:double-alt-arrow-left-bold"
                width="20"
                height="20"
                className="group-data-[collapsible=icon]:rotate-180 transition-transform"
              />
            </button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <UserDropdown user={user} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const isDeveloper = pathname.startsWith("/developer");

  const personalNavItems = [
    {
      name: "ওভারভিউ",
      path: "/dashboard",
      icon: "solar:home-smile-bold",
      exact: true,
    },
    {
      name: "প্রোফাইল",
      path: "/dashboard/profile",
      icon: "solar:user-circle-bold",
      exact: false,
    },
    {
      name: "নিরাপত্তা",
      path: "/dashboard/security",
      icon: "solar:shield-check-bold",
      exact: false,
    },
    {
      name: "গোপনীয়তা",
      path: "/dashboard/privacy",
      icon: "solar:lock-keyhole-bold",
      exact: false,
    },
    {
      name: "বিলিং",
      path: "/dashboard/billing",
      icon: "solar:users-group-two-rounded-bold",
      exact: false,
    },
    {
      name: "সেটিংস",
      path: "/dashboard/settings",
      icon: "solar:bell-bold",
      exact: false,
    },
  ];

  const developerNavItems = [
    {
      name: "অ্যাপস",
      path: "/developer/apps",
      icon: "solar:box-minimalistic-bold",
      exact: false,
    },
    {
      name: "ইউজার",
      path: "/developer/users",
      icon: "solar:users-group-rounded-bold",
      exact: false,
    },
    {
      name: "রোলস",
      path: "/developer/rbac",
      icon: "solar:shield-keyhole-bold",
      exact: false,
    },
    {
      name: "হুকস",
      path: "/developer/hooks",
      icon: "solar:code-file-bold",
      exact: false,
    },
    {
      name: "প্রোটেকশন",
      path: "/developer/protection",
      icon: "solar:shield-warning-bold",
      exact: false,
    },
    {
      name: "অ্যানালিটিক্স",
      path: "/developer/analytics",
      icon: "solar:chart-square-bold",
      exact: false,
    },
    {
      name: "কুইকস্টার্ট",
      path: "/developer/quickstart",
      icon: "solar:rocket-bold",
      exact: false,
    },
    {
      name: "ডকস",
      path: "/developer/docs",
      icon: "solar:document-text-bold",
      exact: false,
    },
  ];

  const navItems = isDeveloper ? developerNavItems : personalNavItems;
  const switchTarget = isDeveloper ? "/dashboard" : "/developer";

  return (
    <div className="lg:hidden fixed bottom-[12px] left-[12px] right-[12px] z-40 flex justify-center pointer-events-none">
      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-2xl border border-border/80 rounded-[28px] p-2 shadow-2xl pointer-events-auto w-full max-w-[460px] overflow-hidden">
        {/* Workspace Mode Switcher Pill Button */}
        <Link
          href={switchTarget}
          title={isDeveloper ? "ব্যক্তিগত অ্যাকাউন্টে যান" : "ডেভেলপার পোর্টালে যান"}
          className="flex flex-col items-center justify-center py-2 px-2.5 rounded-[20px] bg-accent/80 hover:bg-accent text-foreground transition-colors shrink-0 border border-border/60"
        >
          <Icon
            icon={isDeveloper ? "solar:user-id-bold" : "solar:code-square-bold"}
            width="20"
            height="20"
            className="text-primary"
          />
          <span className="text-[10px] font-bold tracking-tight mt-0.5 whitespace-nowrap">
            {isDeveloper ? "ব্যক্তিগত" : "ডেভেলপার"}
          </span>
        </Link>

        <div className="h-6 w-px bg-border shrink-0" />

        {/* Scrollable Navigation Items */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 py-0.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.path
              : pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-[18px] transition-colors transition-transform duration-300 shrink-0 ${
                  isActive
                    ? "bg-foreground text-background shadow-md font-bold scale-[1.02]"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <Icon
                  icon={item.icon}
                  width="20"
                  height="20"
                  className="mb-[2px]"
                />
                <span className="text-[10.5px] tracking-tight whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
