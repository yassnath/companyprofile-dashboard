import dynamic from "next/dynamic";

import { HeroSection } from "@/components/marketing/hero-section";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { WhatsappStickyButton } from "@/components/marketing/whatsapp-sticky-button";

const SocialProofSection = dynamic(
  () => import("@/components/marketing/social-proof-section").then((mod) => mod.SocialProofSection),
);
const ServicesOverviewSection = dynamic(
  () =>
    import("@/components/marketing/services-overview-section").then((mod) => mod.ServicesOverviewSection),
);
const FeaturedWorkSection = dynamic(
  () => import("@/components/marketing/featured-work-section").then((mod) => mod.FeaturedWorkSection),
);
const ProcessTimelineSection = dynamic(
  () =>
    import("@/components/marketing/process-timeline-section").then((mod) => mod.ProcessTimelineSection),
);
const PricingTeaserSection = dynamic(
  () => import("@/components/marketing/pricing-teaser-section").then((mod) => mod.PricingTeaserSection),
);
const FaqSection = dynamic(() => import("@/components/marketing/faq-section").then((mod) => mod.FaqSection));
const FinalCtaSection = dynamic(
  () => import("@/components/marketing/final-cta-section").then((mod) => mod.FinalCtaSection),
);

export default function LandingPage() {
  return (
    <div className="min-h-screen marketing-shell-bg">
      <SiteHeader />
      <main>
        <HeroSection />
        <SocialProofSection />
        <ServicesOverviewSection />
        <FeaturedWorkSection />
        <ProcessTimelineSection />
        <PricingTeaserSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
      <WhatsappStickyButton />
    </div>
  );
}
