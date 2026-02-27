import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

import { BrandLogo } from "@/components/shared/logo";
import { navLinks } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-card/45">
      <div className="shell-container grid gap-10 py-10 md:grid-cols-3">
        <div className="space-y-4">
          <BrandLogo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Digital agency untuk website dan aplikasi modern yang fokus pada hasil bisnis.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-lg font-semibold">Social</h3>
          <div className="flex items-center gap-3">
            <Link href="#" aria-label="Instagram" className="rounded-xl border p-2 hover:bg-accent">
              <Instagram className="size-4" />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="rounded-xl border p-2 hover:bg-accent">
              <Linkedin className="size-4" />
            </Link>
            <Link href="#" aria-label="Facebook" className="rounded-xl border p-2 hover:bg-accent">
              <Facebook className="size-4" />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            2026 Solvix Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
