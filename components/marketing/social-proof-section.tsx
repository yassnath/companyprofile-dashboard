"use client";

import { motion } from "framer-motion";

import { testimonials } from "@/lib/constants";

const logos = ["Finovo", "Komerce", "RantaiID", "Sociota", "QwikPOS", "NusaTech"];

export function SocialProofSection() {
  return (
    <section className="shell-container py-14 sm:py-16">
      <p className="mb-6 text-center text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
        Trusted by growing brands
      </p>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {logos.map((logo) => (
          <div key={logo} className="rounded-xl border bg-card/65 p-3 text-center text-sm font-semibold text-muted-foreground">
            {logo}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.article
            key={item.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.3, delay: index * 0.07 }}
            className="soft-card p-5"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{item.quote}&rdquo;</p>
            <div className="mt-4">
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.role}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
