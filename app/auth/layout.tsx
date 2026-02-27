import type { ReactNode } from "react";
import Link from "next/link";

import { BrandLogo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell-bg relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(160deg,rgba(59,130,246,.06)_0%,transparent_42%,rgba(14,165,233,.08)_100%)]" />
      <div className="w-full max-w-md space-y-5 sm:max-w-lg">
        <div className="flex justify-center">
          <BrandLogo />
        </div>
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border bg-card/65 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
          <span className="size-2 rounded-full bg-emerald-500" />
          Secure client portal
        </div>
        {children}
        <p className="text-center text-xs text-muted-foreground">
          Butuh info layanan? <Link href="/services" className="text-primary underline-offset-4 hover:underline">Lihat Services</Link>
        </p>
      </div>
    </div>
  );
}
