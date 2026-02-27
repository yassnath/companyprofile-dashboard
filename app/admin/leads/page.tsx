import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTimeID } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin Leads",
};

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Leads</h1>
        <p className="mt-1 text-muted-foreground">Daftar lead yang masuk dari form contact.</p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Incoming Leads</CardTitle>
          <CardDescription>Total {leads.length} leads</CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada lead.</p>
          ) : (
            <ul className="space-y-3">
              {leads.map((lead) => (
                <li key={lead.id} className="rounded-xl border bg-background/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTimeID(lead.createdAt)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                  <p className="mt-2 text-sm">{lead.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Source: {lead.sourcePage}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
