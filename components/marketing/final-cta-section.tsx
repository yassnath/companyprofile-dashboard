import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { OrderNowButton } from "@/components/shared/order-now-button";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/lib/constants";

export function FinalCtaSection() {
  return (
    <section className="shell-container pb-14 sm:pb-20">
      <div className="glass-card overflow-hidden p-8 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">Ready to build</p>
            <h2 className="mt-3 max-w-2xl font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Siap meluncurkan produk digital yang lebih cepat dan lebih meyakinkan?
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Ceritakan kebutuhan Anda, kami bantu susun scope, timeline, dan estimasi budget dengan jelas.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:flex-col lg:justify-end">
            <OrderNowButton className="rounded-xl" size="lg">
              Order Now
              <ArrowRight className="ml-2 size-4" />
            </OrderNowButton>
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 size-4" />
                Chat WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
