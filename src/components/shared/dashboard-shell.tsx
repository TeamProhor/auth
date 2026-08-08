"use client";

import { AppSidebar, MobileBottomNav } from "@/components/shared/app-sidebar";
import { ProhorLogo } from "@/components/shared/prohor-logo";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";

function DashboardHeader() {
  const { open, openMobile, isMobile } = useSidebar();
  const isSidebarOpen = isMobile ? openMobile : open;

  if (isSidebarOpen) {
    return null;
  }

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-center bg-background/90 backdrop-blur-xl border-b border-border px-4 py-3 shadow-xs">
      <div className="flex items-center gap-2">
        <ProhorLogo className="size-6 rounded" />
        <span className="font-[800] text-[18px] text-foreground">
          প্রহর অ্যাকাউন্ট
        </span>
      </div>
    </div>
  );
}
export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-background">
        <DashboardHeader />
        <main className="flex-1 w-full h-full overflow-y-auto p-4 pt-[64px] md:p-8 lg:p-12 lg:pt-8 pb-24 lg:pb-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-10">{children}</div>
        </main>
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}
