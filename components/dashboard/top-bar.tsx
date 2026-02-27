import { Bell, Search } from "lucide-react";
import Link from "next/link";

import { ProfileMenu } from "@/components/dashboard/profile-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardTopBar({
  user,
}: {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: "USER" | "ADMIN";
  };
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/88 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-5 md:px-6">
        <SidebarTrigger className="rounded-xl border border-border/70" />
        <div className="min-w-0 md:hidden">
          <p className="truncate font-heading text-sm font-semibold">Client Dashboard</p>
        </div>
        <div className="relative hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <Input
            className="rounded-xl border-border/70 bg-card/70 pl-9"
            placeholder="Cari order, invoice, atau catatan"
            aria-label="Search dashboard content"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden rounded-xl md:inline-flex" asChild>
            <Link href="/app/orders/new">New Order</Link>
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
          <ProfileMenu name={user.name} email={user.email} role={user.role} />
        </div>
      </div>
    </header>
  );
}
