import Link from "next/link";
import { Check } from "lucide-react";

import { OrderNowButton } from "@/components/shared/order-now-button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { pricingPackages } from "@/lib/constants";

export function PricingTeaserSection() {
  return (
    <section className="shell-container py-14 sm:py-18">
      <SectionHeading
        title="Paket Pricing"
        subtitle="Pilih titik awal yang cocok dengan fase bisnis Anda. Scope final selalu dikunci lewat discovery."
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {pricingPackages.map((pkg, index) => (
          <article
            key={pkg.name}
            className={`soft-card flex h-full flex-col p-6 ${index === 1 ? "ring-2 ring-primary/30" : ""}`}
          >
            <h3 className="font-heading text-xl font-semibold">{pkg.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{pkg.description}</p>
            <p className="mt-5 font-heading text-3xl font-bold">{pkg.price}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <OrderNowButton className="w-full rounded-xl" variant={index === 1 ? "default" : "outline"}>
                Pilih {pkg.name}
              </OrderNowButton>
            </div>
          </article>
        ))}
      </div>

      <Button variant="ghost" asChild className="mt-5 px-0">
        <Link href="/pricing">Lihat detail pricing</Link>
      </Button>
    </section>
  );
}
