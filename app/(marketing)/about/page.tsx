import { Check, Compass, Rocket, ShieldCheck } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";

const values = [
  {
    title: "Strategic clarity",
    description: "Keputusan produk harus jelas, terukur, dan relevan dengan target bisnis.",
    icon: Compass,
  },
  {
    title: "Execution quality",
    description: "Implementasi rapi, maintainable, dan siap tumbuh bersama bisnis.",
    icon: Rocket,
  },
  {
    title: "Trust and security",
    description: "Workflow yang transparan, keamanan data, dan standar engineering modern.",
    icon: ShieldCheck,
  },
];

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Solvix Studio, Partner Produk Digital Untuk Tim Ambisius"
        description="Kami adalah digital agency yang menggabungkan strategi produk, desain modern, dan engineering produksi."
      />

      <section className="shell-container py-10 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="soft-card p-7">
            <h2 className="font-heading text-2xl font-semibold">What we build</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <Check className="mt-0.5 size-4 text-primary" />
                Conversion-focused landing pages
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 size-4 text-primary" />
                Internal dashboards and operational systems
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 size-4 text-primary" />
                End-to-end web and mobile products
              </li>
            </ul>
          </article>

          <article className="soft-card p-7">
            <h2 className="font-heading text-2xl font-semibold">How we collaborate</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Kami bekerja dalam sprint pendek, feedback cepat, dan progress yang selalu terlihat. Setiap milestone
              punya output yang bisa dievaluasi bersama.
            </p>
            <div className="mt-5 rounded-xl border bg-background/80 p-4 text-sm text-muted-foreground">
              Typical stack: Next.js, React Native, Node, PostgreSQL, cloud-native workflows.
            </div>
          </article>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="soft-card p-5">
              <value.icon className="size-5 text-primary" />
              <h3 className="mt-3 font-heading text-lg font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
