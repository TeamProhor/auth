"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { ArrowLeft, Moon, Sun, User as UserIcon } from "@/components/icons";
import { AppSidebar, MobileBottomNav } from "@/components/shared/app-sidebar";
import { ProhorLogo } from "@/components/shared/prohor-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/db/schema";

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: User | null;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  const name = user?.name || "ব্যবহারকারী";
  const initial = (name[0] || user?.email?.[0] || "U").toUpperCase();
  const avatarUrl = user?.avatarUrl || undefined;

  const isLoginPage = pathname.startsWith("/login");
  const shouldShowBottomNav = !isLoginPage;

  return (
    <div className="flex h-[100dvh] w-full bg-muted text-foreground font-sans overflow-hidden relative">
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex w-full border-b border-border bg-background/80 backdrop-blur-xl px-3 sm:px-4 py-2.5 shadow-xs">
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2.5">
            <button
              type="button"
              aria-label="Go Back"
              onClick={() => router.back()}
              className="p-1 rounded-lg hover:bg-muted active:scale-95 transition-colors text-foreground cursor-pointer"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={() => setIsSidebarOpen(true)}
              className="flex flex-row items-center gap-2 text-left cursor-pointer"
            >
              <ProhorLogo className="size-6 rounded" />
              <h3 className="text-[17px] font-extrabold text-foreground whitespace-nowrap mt-[1px]">
                অ্যাকাউন্ট
              </h3>
            </button>
          </div>

          <div className="flex flex-row items-center gap-3">
            <button
              type="button"
              aria-label="থিম পরিবর্তন করুন (Toggle Theme)"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="size-8 rounded-full border border-border bg-background/80 hover:bg-muted flex items-center justify-center transition-colors text-foreground cursor-pointer"
            >
              <Sun size={16} className="hidden dark:block" />
              <Moon size={16} className="dark:hidden block" />
            </button>

            <Link
              href={user ? "/dashboard/profile" : "/login"}
              className="relative size-8 rounded-full overflow-hidden border border-border shadow-xs hover:opacity-85 transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Avatar className="size-8">
                {avatarUrl ? (
                  <AvatarImage
                    src={avatarUrl}
                    alt={name}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="text-xs font-bold bg-muted text-foreground">
                  {user ? (
                    initial
                  ) : (
                    <UserIcon size={16} className="text-muted-foreground" />
                  )}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <button
        type="button"
        aria-label="Close sidebar"
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300 lg:hidden cursor-default border-none outline-none ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Drawer Container */}
      <div
        className={`fixed lg:static top-[8px] bottom-[8px] left-[8px] right-[8px] lg:inset-auto z-50 lg:z-10 bg-muted lg:bg-transparent rounded-[24px] lg:rounded-none border-[0.5px] border-border lg:border-none p-[16px] lg:p-0 transition-transform duration-500 ease-[cubic-bezier(0.075,0.82,0.165,1)] lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-[110%]"
        }`}
      >
        <AppSidebar user={user} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-background relative overflow-hidden rounded-[0px] lg:rounded-[24px] border-0 lg:border-[0.5px] lg:border-border mt-0 lg:my-[20px] lg:mr-[20px] pt-[56px] lg:pt-0">
        <div
          className={`w-full h-full overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 ${
            shouldShowBottomNav ? "pb-24 sm:pb-24 lg:pb-10" : "pb-10"
          } custom-scrollbar`}
        >
          <div className="max-w-5xl mx-auto space-y-10">{children}</div>
        </div>
      </div>

      {shouldShowBottomNav && <MobileBottomNav />}
    </div>
  );
}
