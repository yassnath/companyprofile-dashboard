import Link from "next/link";
import { ArrowUpRight, Code2, LayoutPanelLeft, MonitorSmartphone, Smartphone, Sparkles, Ticket } from "lucide-react";

import { OrderNowButton } from "@/components/shared/order-now-button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { serviceCatalog } from "@/lib/constants";

const iconMap = {
  WEB_APP: Code2,
  COMPANY_PROFILE: LayoutPanelLeft,
  LANDING_PAGE: Sparkles,
  DIGITAL_INVITATION: Ticket,
  MOBILE_APP: Smartphone,
  DESKTOP_APP: MonitorSmartphone,
} as const;

export function ServicesOverviewSection() {
  return (
    <section className="shell-container py-14 sm:py-20">
      <SectionHeading
        title="Layanan Yang Kami Bangun"
        subtitle="Setiap layanan dirancang untuk performa tinggi, skalabilitas, dan pengalaman pengguna premium."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {serviceCatalog.map((service) => {
          const Icon = iconMap[service.type];

          return (
            <article key={service.type} className="soft-card flex h-full flex-col p-6 transition duration-300 hover:translate-y-[-4px]">
              <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </div>
              <h3 className="font-heading text-xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
              <p className="mt-4 text-xs font-medium text-muted-foreground">Estimasi pengerjaan: {service.delivery}</p>
              <div className="mt-6 flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="px-0">
                  <Link href="/services">
                    Detail
                    <ArrowUpRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/services">Explore All Services</Link>
        </Button>
        <OrderNowButton variant="outline">Order Now</OrderNowButton>
      </div>
    </section>
  );
}
