"use client";

import type { ReactNode } from "react";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { DashboardTopBar } from "@/components/dashboard/top-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function DashboardShell({
  user,
  children,
}: {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: "USER" | "ADMIN";
  };
  children: ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar role={user.role} />
      <SidebarInset className="dashboard-shell-bg">
        <DashboardTopBar user={user} />
        <div className="flex-1 px-3 py-4 pb-24 sm:px-5 sm:py-5 md:px-6 md:py-6 md:pb-8">{children}</div>
      </SidebarInset>
      <MobileBottomNav />
    </SidebarProvider>
  );
}
