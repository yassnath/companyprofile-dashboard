import { FinalCtaSection } from "@/components/marketing/final-cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { ServicesCatalog } from "@/components/marketing/services-catalog";

export const metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Pilih Layanan Digital Sesuai Kebutuhan Bisnis"
        description="Dari landing page hingga aplikasi enterprise, seluruh layanan Solvix dibangun dengan standar produksi modern."
      />
      <section className="shell-container py-10 sm:py-12">
        <ServicesCatalog />
      </section>
      <FinalCtaSection />
    </>
  );
}
