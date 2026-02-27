import { Check } from "lucide-react";

import { OrderNowButton } from "@/components/shared/order-now-button";
import { pricingPackages } from "@/lib/constants";

export function PricingGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {pricingPackages.map((pkg, idx) => (
        <article key={pkg.name} className={`soft-card flex h-full flex-col p-6 ${idx === 1 ? "ring-2 ring-primary/40" : ""}`}>
          <p className="font-heading text-2xl font-semibold">{pkg.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{pkg.description}</p>
          <p className="mt-6 font-heading text-4xl font-bold">{pkg.price}</p>
          <ul className="mt-5 flex-1 space-y-2 text-sm">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <OrderNowButton className="mt-6 w-full rounded-xl" variant={idx === 1 ? "default" : "outline"}>
            Start {pkg.name}
          </OrderNowButton>
        </article>
      ))}
    </div>
  );
}
