"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BrandLogo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/constants";

export function SiteHeader() {
  const { status } = useSession();

  const primaryHref =
    status === "authenticated" ? "/app/orders/new" : "/auth/sign-in?callbackUrl=%2Fapp%2Forders%2Fnew";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/78 backdrop-blur-xl">
      <div className="shell-container flex h-18 items-center justify-between gap-4">
        <BrandLogo />

        <NavigationMenu viewport={false} className="hidden md:flex">
          <NavigationMenuList>
            {navLinks.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild className="bg-transparent px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Link href={item.href}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href={status === "authenticated" ? "/app" : "/auth/sign-in"}>Sign in</Link>
          </Button>
          <Button className="rounded-xl" asChild>
            <Link href={primaryHref}>Order Now</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl" aria-label="Open navigation menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88%] rounded-l-2xl sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>
                  <BrandLogo compact />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2">
                {navLinks.map((item) => (
                  <Button key={item.href} variant="ghost" className="justify-start" asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href={status === "authenticated" ? "/app" : "/auth/sign-in"}>Sign in</Link>
                </Button>
                <Button className="mt-2" asChild>
                  <Link href={primaryHref}>Order Now</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
