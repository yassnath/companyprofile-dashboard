import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { ContactForm } from "@/components/marketing/contact-form";
import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/lib/constants";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Diskusikan Proyek Anda"
        description="Kirim kebutuhan Anda melalui form atau langsung chat WhatsApp untuk respon lebih cepat."
      />

      <section className="shell-container py-10 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="soft-card p-7">
            <h2 className="font-heading text-2xl font-semibold">Talk to Solvix</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ceritakan goals produk, timeline, dan kisaran budget agar kami bisa menyiapkan rekomendasi terbaik.
            </p>

            <div className="mt-6 max-w-xl">
              <ContactForm sourcePage="/contact" />
            </div>
          </article>

          <aside className="soft-card p-7">
            <h3 className="font-heading text-xl font-semibold">Fast lane via WhatsApp</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Untuk diskusi cepat, klik tombol di bawah. Tim kami biasanya merespon dalam jam kerja.
            </p>
            <Button asChild className="mt-5 w-full rounded-xl" size="lg">
              <Link href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 size-4" />
                Chat WhatsApp
              </Link>
            </Button>

            <div className="mt-8 rounded-xl border bg-background/80 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Operational Hours</p>
              <p className="mt-1">Senin - Jumat, 09.00 - 18.00 WIB</p>
              <p>Sabtu, 10.00 - 15.00 WIB</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
