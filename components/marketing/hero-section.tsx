"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { OrderNowButton } from "@/components/shared/order-now-button";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function HeroSection() {
  return (
    <section className="hero-gradient relative overflow-hidden border-b border-border/60">
      <div className="shell-container relative py-16 sm:py-20 lg:py-28">
        <div className="absolute -top-28 left-2 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute right-0 -bottom-20 h-72 w-72 rounded-full bg-accent/50 blur-3xl" />

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="space-y-7"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-xs font-semibold text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Premium Digital Product Agency
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Build Modern Websites & Apps That Convert
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Solvix Studio membantu bisnis merancang produk digital yang cantik, cepat, dan terukur, dari
              strategi hingga launch.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl">
                <Link href="/services">
                  See Services
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <OrderNowButton size="lg" variant="outline" className="rounded-xl">
                Order Now
              </OrderNowButton>
            </motion.div>

            <motion.div variants={fadeUp} className="grid max-w-xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div className="metric-card metric-blue border-primary/20 p-4">
                <p className="font-heading text-2xl font-semibold">120+</p>
                <p className="text-muted-foreground">Proyek terkirim</p>
              </div>
              <div className="metric-card metric-emerald border-emerald-400/20 p-4">
                <p className="font-heading text-2xl font-semibold">4.9/5</p>
                <p className="text-muted-foreground">Client rating</p>
              </div>
              <div className="metric-card metric-violet border-violet-400/20 p-4">
                <p className="font-heading text-2xl font-semibold">38%</p>
                <p className="text-muted-foreground">Avg conversion lift</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            className="glass-card relative p-5 sm:p-7"
          >
            <div className="absolute right-4 top-4 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
              Live Preview
            </div>
            <div className="space-y-4">
              <div className="h-3 w-24 rounded-full bg-muted" />
              <div className="h-8 w-full rounded-xl bg-muted/70" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2 rounded-xl border bg-background/60 p-4">
                  <p className="text-xs text-muted-foreground">Leads this week</p>
                  <p className="font-heading text-2xl font-semibold">+184</p>
                </div>
                <div className="space-y-2 rounded-xl border bg-background/60 p-4">
                  <p className="text-xs text-muted-foreground">Landing speed</p>
                  <p className="font-heading text-2xl font-semibold">1.8s</p>
                </div>
              </div>
              <div className="rounded-xl border bg-background/60 p-4">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Conversion target</span>
                  <span>85%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 w-[85%] rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
