"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useTransition } from "react";
import { logoutAction } from "@/actions/auth";
import { ChevronLeft, Logout, Moon, Sun } from "@/components/icons";
import { ProhorLogo } from "@/components/shared/prohor-logo";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { SubmitButton } from "@/components/submit-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { User } from "@/db/schema";
import { PERSONAL_NAV_ITEMS } from "@/lib/constants/ui";

export function AppSidebar({
  user,
  onClose,
  defaultCollapsed = false,
}: {
  user?: User | null;
  onClose?: () => void;
  defaultCollapsed?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const name = user?.name || "ব্যবহারকারী";
  const email = user?.email || "";
  const avatarUrl = user?.avatarUrl || undefined;
  const initial = (name[0] || email[0] || "U").toUpperCase();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  const navItems = PERSONAL_NAV_ITEMS;

  return (
    <aside
      className={`w-full h-full lg:h-[calc(100vh-40px)] lg:m-[20px] shrink-0 z-10 flex flex-col pt-0 lg:pt-[16px] justify-between overflow-x-hidden overflow-y-auto no-scrollbar transition-[width] duration-300 ease-in-out ${
        isCollapsed ? "lg:w-[40px]" : "lg:w-[192px]"
      }`}
    >
      <div className="flex flex-col gap-1.5 w-full">
        {/* Logo and Mobile Close */}
        <div className="flex items-center justify-between w-full h-8">
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="flex items-center h-8 px-2 rounded-lg hover:bg-accent transition-colors overflow-hidden shrink-0 w-full"
                />
              }
            >
              <div className="size-6 shrink-0 flex items-center justify-center">
                <ProhorLogo className="size-5 rounded" />
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${
                  isCollapsed
                    ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none"
                    : "max-w-[140px] opacity-100 translate-x-0 ml-2"
                }`}
              >
                <h3 className="font-bold text-sm whitespace-nowrap text-foreground">
                  অ্যাকাউন্ট
                </h3>
              </div>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">অ্যাকাউন্ট</TooltipContent>
            )}
          </Tooltip>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="flex lg:hidden p-1.5 rounded-lg hover:bg-accent transition-colors text-foreground cursor-pointer shrink-0"
          >
            <svg
              className="size-5"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Close Sidebar</title>
              <rect
                x="4"
                y="5"
                width="16"
                height="14"
                rx="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M15 19L15 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Collapse button (Desktop) */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={() => {
                  const nextVal = !isCollapsed;
                  setIsCollapsed(nextVal);
                  document.cookie = `sidebar_collapsed=${nextVal}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
                }}
                className="hidden lg:flex items-center h-7 px-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground overflow-hidden shrink-0 cursor-pointer w-full"
              />
            }
          >
            <div className="size-6 shrink-0 flex items-center justify-center">
              <ChevronLeft
                size={14}
                className={`transition-transform duration-300 ease-in-out ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${
                isCollapsed
                  ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none"
                  : "max-w-[140px] opacity-100 translate-x-0 ml-2"
              }`}
            >
              <span className="text-[11px] font-medium whitespace-nowrap">
                সংকুচিত করুন
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isCollapsed ? "সাইডবার প্রসারণ করুন" : "সাইডবার সংকুচিত করুন"}
          </TooltipContent>
        </Tooltip>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-0.5 w-full mt-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/dashboard" && pathname.startsWith(item.url));
            const ItemIcon = item.icon;

            return (
              <Tooltip key={item.title}>
                <TooltipTrigger
                  render={
                    <Link
                      href={item.url}
                      onClick={onClose}
                      className={`group relative flex items-center h-8 px-2 rounded-lg transition-colors overflow-hidden shrink-0 w-full ${
                        isActive
                          ? "bg-accent font-semibold text-foreground"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      }`}
                    />
                  }
                >
                  <div className="size-6 shrink-0 flex items-center justify-center">
                    <ItemIcon size={16} />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${
                      isCollapsed
                        ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none"
                        : "max-w-[140px] opacity-100 translate-x-0 ml-2"
                    }`}
                  >
                    <span className="text-[12.5px] whitespace-nowrap">
                      {item.title}
                    </span>
                  </div>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">{item.title}</TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="flex flex-col gap-2 mt-6 lg:mt-8 px-0 border-t border-border/50 pt-2 w-full">
        <div className="flex items-center w-full h-8 px-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label="থিম পরিবর্তন করুন (Toggle Theme)"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="size-6 rounded-md hover:bg-accent flex items-center justify-center transition-colors text-foreground cursor-pointer shrink-0"
                />
              }
            >
              <Sun size={16} className="hidden dark:block" />
              <Moon size={16} className="dark:hidden block" />
            </TooltipTrigger>
            <TooltipContent side="right">থিম পরিবর্তন করুন</TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="flex items-center justify-between w-full h-9 px-2 rounded-lg hover:bg-accent/40 transition-colors shrink-0 cursor-pointer border-none outline-none text-left"
              />
            }
          >
            <div className="flex items-center min-w-0">
              <div className="size-6 shrink-0 flex items-center justify-center">
                <Avatar className="size-6 shrink-0">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold text-[10px]">
                    {initial}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out flex flex-col min-w-0 ${
                  isCollapsed
                    ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none"
                    : "max-w-[140px] opacity-100 translate-x-0 ml-2.5"
                }`}
              >
                <span className="text-xs font-semibold text-foreground truncate">
                  {name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {email}
                </span>
              </div>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed
                  ? "max-w-0 opacity-0 pointer-events-none"
                  : "max-w-[20px] opacity-100"
              }`}
            >
              <Logout
                size={15}
                className="text-muted-foreground group-hover:text-destructive transition-colors shrink-0"
              />
            </div>
          </TooltipTrigger>
          {isCollapsed && <TooltipContent side="right">লগআউট</TooltipContent>}
        </Tooltip>
      </div>

      <ResponsiveDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="লগআউট করবেন?"
        description="আপনি কি নিশ্চিত যে আপনি আপনার অ্যাকাউন্ট থেকে লগআউট করতে চান?"
        trigger={null}
        className="sm:max-w-xl"
      >
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
          <Button
            variant="ghost"
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
            className="rounded-xl text-xs font-semibold cursor-pointer"
          >
            বাতিল
          </Button>
          <SubmitButton
            variant="destructive"
            onClick={handleLogout}
            isPending={isPending}
            className="rounded-xl text-xs font-semibold cursor-pointer"
          >
            লগআউট করুন
          </SubmitButton>
        </div>
      </ResponsiveDialog>
    </aside>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const navItems = PERSONAL_NAV_ITEMS;

  return (
    <div className="lg:hidden fixed bottom-[12px] left-[12px] right-[12px] z-30 flex justify-center pointer-events-none">
      <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-2xl border border-border/80 rounded-[28px] p-2 shadow-2xl pointer-events-auto w-full max-w-[460px] overflow-hidden">
        {/* Scrollable Navigation Items */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 py-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/dashboard" && pathname.startsWith(item.url));
            const ItemIcon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.url}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-[18px] transition-all duration-300 shrink-0 ${
                  isActive
                    ? "bg-foreground text-background shadow-md font-bold scale-[1.02]"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <ItemIcon size={20} className="mb-[2px]" />
                <span className="text-[10.5px] tracking-tight whitespace-nowrap">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
