import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { WHATSAPP_URL } from "@/lib/constants";

export function WhatsappStickyButton() {
  return (
    <Link
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 bottom-22 z-30 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-xl transition hover:translate-y-[-2px] md:hidden"
    >
      <MessageCircle className="size-4" />
      WhatsApp
    </Link>
  );
}
