import { SectionHeading } from "@/components/shared/section-heading";

const steps = ["Discover", "Design", "Build", "Launch", "Support"];

export function ProcessTimelineSection() {
  return (
    <section className="shell-container py-14 sm:py-18">
      <SectionHeading
        title="Proses Kerja Terstruktur"
        subtitle="Workflow ringkas yang menjaga kualitas, transparansi, dan kecepatan delivery."
      />

      <ol className="mt-8 grid gap-4 md:grid-cols-5">
        {steps.map((step, index) => (
          <li key={step} className="soft-card relative p-5">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
              {index + 1}
            </span>
            <h3 className="mt-3 font-heading text-lg font-semibold">{step}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === "Support"
                ? "Stabilisasi pasca launch dan iterasi lanjutan."
                : `Fase ${step.toLowerCase()} dengan deliverable yang jelas.`}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
