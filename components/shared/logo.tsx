import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function BrandLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)} aria-label="Solvix Studio Home">
      <span className="relative h-10 w-10 overflow-hidden rounded-xl border bg-card p-1.5 shadow-sm">
        <Image src="/brand/logo2.png" alt="Solvix Studio" fill sizes="40px" className="object-contain" priority />
      </span>
      {!compact ? (
        <span className="font-heading text-base font-semibold tracking-tight">Solvix Studio</span>
      ) : null}
    </Link>
  );
}
