import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateID, formatIDR } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata = {
  title: "Billing",
};

export default async function BillingPage() {
  const user = await requireUser();

  const invoices = await prisma.order.findMany({
    where: user.role === "ADMIN" ? {} : { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      paymentStatus: true,
      budgetMin: true,
      budgetMax: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-muted-foreground">Invoice summary dan status pembayaran (placeholder).</p>
      </div>

      <Tabs defaultValue="invoices">
        <TabsList className="rounded-xl">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Integrasi payment gateway belum diaktifkan.</CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada invoice.</p>
              ) : (
                <ul className="space-y-3">
                  {invoices.map((invoice) => (
                    <li key={invoice.id} className="rounded-xl border bg-background/70 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium">{invoice.title}</p>
                        <Badge variant={invoice.paymentStatus === "PAID" ? "default" : "secondary"}>
                          {invoice.paymentStatus}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{invoice.id}</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Est. nilai: {formatIDR(invoice.budgetMin)} - {formatIDR(invoice.budgetMax)}
                      </p>
                      <p className="text-xs text-muted-foreground">Dibuat: {formatDateID(invoice.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="mt-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Placeholder manajemen metode pembayaran.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Penyimpanan kartu/metode transfer akan tersedia setelah integrasi payment gateway aktif.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
