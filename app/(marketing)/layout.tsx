import type { ReactNode } from "react";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { WhatsappStickyButton } from "@/components/marketing/whatsapp-sticky-button";
import { PageTransition } from "@/components/shared/page-transition";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen marketing-shell-bg">
      <SiteHeader />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <WhatsappStickyButton />
    </div>
  );
}
