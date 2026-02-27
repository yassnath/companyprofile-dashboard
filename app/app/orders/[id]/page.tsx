import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { orderStatusLabel, serviceTypeLabel } from "@/lib/constants";
import { formatDateID, formatDateTimeID, formatIDR } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      statusHistory: {
        orderBy: { createdAt: "asc" },
        include: {
          actorUser: {
            select: {
              name: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  if (user.role !== "ADMIN" && order.userId !== user.id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">{order.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Order ID: {order.id}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Ringkasan project dan informasi utama.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Service</p>
                <p className="font-medium">{serviceTypeLabel[order.serviceType]}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge className="mt-1" variant={order.status === "CANCELLED" ? "destructive" : "secondary"}>
                  {orderStatusLabel[order.status]}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Deadline</p>
                <p className="font-medium">{formatDateID(order.deadline)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Budget Range</p>
                <p className="font-medium">
                  {formatIDR(order.budgetMin)} - {formatIDR(order.budgetMax)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground">Description</p>
              <p className="mt-1 leading-relaxed">{order.description}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Target Audience</p>
              <p className="mt-1">{order.targetAudience || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Invoice Status</CardTitle>
            <CardDescription>Placeholder untuk status pembayaran invoice.</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"}>{order.paymentStatus}</Badge>
            <p className="mt-3 text-sm text-muted-foreground">
              Integrasi payment gateway belum diaktifkan. Status pembayaran ditampilkan sebagai placeholder.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Riwayat perubahan status order.</CardDescription>
          </CardHeader>
          <CardContent>
            {order.statusHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada perubahan status.</p>
            ) : (
              <ul className="space-y-3">
                {order.statusHistory.map((history) => (
                  <li key={history.id} className="rounded-xl border bg-background/80 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="outline">{orderStatusLabel[history.status]}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDateTimeID(history.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm">{history.note || "Status update"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">by {history.actorUser?.name || "System"}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>Placeholder upload file project.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                Upload file akan tersedia pada iterasi berikutnya. Saat ini gunakan link external di deskripsi/referensi.
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Placeholder kanal komunikasi client dan tim Solvix.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-background/80 p-4 text-sm text-muted-foreground">
                Fitur messaging akan segera hadir. Untuk saat ini komunikasi melalui WhatsApp atau email.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
