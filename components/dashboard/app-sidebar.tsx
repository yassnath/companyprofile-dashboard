"use client";

import Link from "next/link";
import { ClipboardList, Globe, Home, MailCheck, PlusSquare, ShieldCheck, UserCircle2, WalletCards } from "lucide-react";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { adminNavLinks, appNavLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap = {
  Home,
  ClipboardList,
  PlusSquare,
  WalletCards,
  UserCircle2,
  ShieldCheck,
  MailCheck,
};

const iconTone: Record<string, string> = {
  Home: "text-sky-500",
  ClipboardList: "text-indigo-500",
  PlusSquare: "text-emerald-500",
  WalletCards: "text-amber-500",
  UserCircle2: "text-fuchsia-500",
  ShieldCheck: "text-cyan-500",
  MailCheck: "text-teal-500",
};

function isActive(pathname: string, href: string) {
  if (href === "/app") {
    return pathname === "/app";
  }
  return pathname.startsWith(href);
}

export function AppSidebar({ role }: { role?: "USER" | "ADMIN" }) {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="px-2 pt-3">
        <div className="rounded-2xl border border-sidebar-border/80 bg-sidebar-accent/40 p-2">
          <BrandLogo className="px-1 py-1" />
          <div className="mt-2 px-2 pb-1 group-data-[collapsible=icon]:hidden">
            <p className="text-xs text-sidebar-foreground/70">Workspace</p>
            <p className="font-heading text-sm font-semibold">Solvix Client Portal</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pt-0">
          <SidebarGroupLabel className="px-2 text-[11px] tracking-[0.12em] uppercase">Customer App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appNavLinks.map((item) => {
                const Icon = iconMap[item.icon];
                const active = isActive(pathname, item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                      className={cn(
                        "h-10 rounded-xl border border-transparent px-2 transition",
                        "data-[active=true]:border-primary/25 data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary/14 data-[active=true]:to-chart-2/10",
                      )}
                    >
                      <Link href={item.href}>
                        <span
                          className={cn(
                            "inline-flex size-7 items-center justify-center rounded-lg border border-border/70 bg-background/80",
                            iconTone[item.icon],
                          )}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {role === "ADMIN" ? (
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-[11px] tracking-[0.12em] uppercase">Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavLinks.map((item) => {
                  const Icon = iconMap[item.icon];
                  const active = isActive(pathname, item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className={cn(
                          "h-10 rounded-xl border border-transparent px-2 transition",
                          "data-[active=true]:border-primary/25 data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary/14 data-[active=true]:to-chart-2/10",
                        )}
                      >
                        <Link href={item.href}>
                          <span
                            className={cn(
                              "inline-flex size-7 items-center justify-center rounded-lg border border-border/70 bg-background/80",
                              iconTone[item.icon],
                            )}
                          >
                            <Icon className="size-4" />
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="gap-3 p-2">
        <div className="rounded-xl border border-sidebar-border/80 bg-sidebar-accent/45 p-3 text-xs text-sidebar-foreground/80 group-data-[collapsible=icon]:hidden">
          <p className="font-medium">System Status</p>
          <div className="mt-2 flex items-center justify-between">
            <span>Portal</span>
            <Badge variant="secondary" className="rounded-md border-0 bg-emerald-500/18 text-emerald-700 dark:text-emerald-300">
              Online
            </Badge>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Back to Website"
              className="h-10 rounded-xl border border-transparent px-2 hover:border-border/80"
            >
              <Link href="/">
                <span className="inline-flex size-7 items-center justify-center rounded-lg border border-border/70 bg-background/80 text-sky-500">
                  <Globe className="size-4" />
                </span>
                <span>Back to Website</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
