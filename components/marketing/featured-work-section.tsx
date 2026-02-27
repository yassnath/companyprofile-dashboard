import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/lib/constants";

export function FeaturedWorkSection() {
  return (
    <section className="border-y border-border/60 bg-card/45 py-14 sm:py-18">
      <div className="shell-container">
        <SectionHeading
          title="Featured Work"
          subtitle="Beberapa hasil kolaborasi terbaru yang berdampak langsung ke metrik bisnis client."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <article key={study.title} className="glass-card p-6">
              <h3 className="font-heading text-xl font-semibold">{study.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{study.description}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {study.metrics.map((metric) => (
                  <li key={metric} className="rounded-lg border bg-background/70 px-3 py-2 font-medium">
                    {metric}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <Button asChild variant="ghost" className="mt-6 px-0">
          <Link href="/work">
            Lihat semua studi kasus
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
