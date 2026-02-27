import { FaqSection } from "@/components/marketing/faq-section";
import { FinalCtaSection } from "@/components/marketing/final-cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { PricingGrid } from "@/components/marketing/pricing-grid";

export const metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Paket Fleksibel Untuk Tiap Fase Pertumbuhan"
        description="Semua paket dapat disesuaikan dengan kebutuhan produk, timeline, dan prioritas bisnis Anda."
      />
      <section className="shell-container py-10 sm:py-12">
        <PricingGrid />
      </section>
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
