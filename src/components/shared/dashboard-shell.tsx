"use client";

import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-background">
        <div className="lg:hidden absolute top-0 left-0 right-0 z-50 flex p-4 pointer-events-none">
          <div className="w-full flex flex-row items-center justify-between bg-background/80 backdrop-blur-xl border border-border rounded-[24px] px-5 py-3 shadow-sm pointer-events-auto">
            <div className="flex flex-row items-center gap-2">
              <span className="font-[800] text-[18px]">প্রহর</span>
            </div>
            <SidebarTrigger className="bg-accent border border-border size-8" />
          </div>
        </div>
        <main className="flex-1 w-full h-full overflow-y-auto p-4 md:p-8 lg:p-12 pt-[96px] lg:pt-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-10">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
