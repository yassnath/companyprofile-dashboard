export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-border/70 py-14 sm:py-18">
      <div className="shell-container">
        <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl font-heading text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}
