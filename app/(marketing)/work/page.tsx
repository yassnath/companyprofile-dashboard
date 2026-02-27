import { PageHero } from "@/components/marketing/page-hero";
import { caseStudies } from "@/lib/constants";

export const metadata = {
  title: "Work",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Case Studies Yang Berfokus Pada Hasil"
        description="Setiap proyek dirancang untuk menjawab metrik bisnis utama: konversi, retensi, dan kecepatan eksekusi tim."
      />
      <section className="shell-container py-10 sm:py-12">
        <div className="grid gap-5 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <article key={study.title} className="glass-card p-6">
              <h2 className="font-heading text-2xl font-semibold">{study.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{study.description}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {study.metrics.map((metric) => (
                  <li key={metric} className="rounded-lg border bg-background/80 px-3 py-2 font-medium">
                    {metric}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
