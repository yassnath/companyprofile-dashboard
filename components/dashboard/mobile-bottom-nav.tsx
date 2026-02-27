"use client";

import Link from "next/link";
import { ClipboardList, Home, PlusSquare, UserCircle2, WalletCards } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/orders", label: "Orders", icon: ClipboardList },
  { href: "/app/orders/new", label: "New", icon: PlusSquare },
  { href: "/app/billing", label: "Billing", icon: WalletCards },
  { href: "/app/profile", label: "Profile", icon: UserCircle2 },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-30 border-t border-border/70 bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.25rem)] backdrop-blur md:hidden"
      aria-label="Mobile dashboard navigation"
    >
      <ul className="grid grid-cols-5 gap-1 py-1">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== "/app" && pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl py-2.5 text-[11px] font-medium text-muted-foreground transition",
                  active &&
                    "bg-gradient-to-br from-primary/18 to-chart-2/14 text-foreground shadow-[0_10px_22px_-16px_rgba(14,165,233,.65)]",
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
