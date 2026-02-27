"use client";

import { LifeBuoy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl">
          <LifeBuoy className="mr-2 size-4" />
          Need Help
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Need assistance?</DialogTitle>
          <DialogDescription>
            Untuk bantuan cepat terkait order, gunakan halaman contact atau WhatsApp CTA pada website utama.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
